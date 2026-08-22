/**
 * Regression check for SOR-155: skin click-region resolution.
 *
 * Red/green signal: parse the real headspace.wms through the real skinParser
 * and regionMapper with the exact handler keys WMPPlayer registers, then
 * assert every interactive region resolves a click handler. Goes red while
 * the minimize/close buttons are dead, green once region ids resolve.
 *
 * Run: npx tsx scripts/verify-wmp-regions.ts
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseDocument } from 'htmlparser2';

/* Minimal DOMParser stand-in backed by htmlparser2 (transitive dep), covering
 * only the surface skinParser touches: querySelector(tag), tagName, children,
 * getAttribute, hasAttribute. */
class FakeElement {
  constructor(private node: any) {}
  get tagName(): string {
    return this.node.name ?? '';
  }
  get children(): FakeElement[] {
    return (this.node.children ?? [])
      .filter((c: any) => c.type === 'tag')
      .map((c: any) => new FakeElement(c));
  }
  getAttribute(name: string): string | null {
    return this.node.attribs?.[name] ?? null;
  }
  hasAttribute(name: string): boolean {
    return this.node.attribs ? name in this.node.attribs : false;
  }
  querySelector(tag: string): FakeElement | null {
    const walk = (n: any): any => {
      for (const c of n.children ?? []) {
        if (c.type === 'tag') {
          if (c.name === tag) return c;
          const hit = walk(c);
          if (hit) return hit;
        }
      }
      return null;
    };
    const found = this.node.name === tag ? this.node : walk(this.node);
    return found ? new FakeElement(found) : null;
  }
}

(globalThis as any).DOMParser = class {
  parseFromString(content: string) {
    return new FakeElement(parseDocument(content, { xmlMode: true }));
  }
};

async function main() {
  // Imported after the DOMParser shim is installed (used at call time anyway).
  const { parseSkinXML } = await import('../src/lib/wmp/skinParser');
  const { parseButtonGroup } = await import('../src/lib/wmp/regionMapper');

  const wms = readFileSync(
    join(__dirname, '..', 'public', 'assets', 'skins', 'headspace', 'headspace.wms'),
    'utf8'
  );
  const skinDef = await parseSkinXML(wms);

  // The exact keys WMPPlayer.createClickHandlers registers.
  const handlers = new Map<string, () => void>([
    ['playelement', () => {}],
    ['stopelement', () => {}],
    ['nextelement', () => {}],
    ['prevelement', () => {}],
    ['minimize', () => {}],
    ['close', () => {}],
  ]);

  // Bounds scanning is irrelevant to id/handler resolution; empty pixel data
  // makes calculateColorBounds a no-op.
  const stubImageData = { width: 0, height: 0, data: new Uint8ClampedArray(0) } as ImageData;

  const groups: any[] = [];
  const collect = (els: any[]) => {
    for (const el of els) {
      if (el.type === 'buttongroup') groups.push(el);
      if (el.children?.length) collect(el.children);
    }
  };
  collect(skinDef.view.elements);

  const regions = groups.flatMap((g) => parseButtonGroup(g, stubImageData, handlers));

  console.log('regions:');
  for (const r of regions) {
    console.log(
      `  id=${JSON.stringify(r.id)} toolTip=${JSON.stringify(r.toolTip)} handler=${r.onClick ? 'YES' : 'NO'}`
    );
  }

  const failures: string[] = [];
  for (const want of ['minimize', 'close', 'playelement', 'stopelement', 'nextelement', 'prevelement']) {
    const region = regions.find((r) => r.id === want);
    if (!region) failures.push(`no region with id "${want}"`);
    else if (!region.onClick) failures.push(`region "${want}" has no click handler`);
  }
  const ids = regions.map((r) => r.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) failures.push(`colliding region ids: ${JSON.stringify(dupes)}`);

  if (failures.length) {
    console.error('RED:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log('GREEN: all interactive regions resolve handlers');
}

main().catch((err) => {
  console.error('loop crashed:', err);
  process.exit(1);
});
