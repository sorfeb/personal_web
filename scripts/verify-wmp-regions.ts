/**
 * Regression check for the WMS skin interpreter.
 *
 * Two things are asserted:
 *
 *  1. Every skin in the registry parses, yields a sized view, and produces the
 *     transport elements the player wires handlers to. This is the guard that
 *     the parser stayed generic rather than drifting back toward headspace.
 *  2. SOR-155: headspace's click regions all resolve a handler, including the
 *     minimize/close buttons that carry no `id` and are addressed by script.
 *
 * The parser needs no DOM, so unlike the previous version of this script there
 * is no DOMParser shim here.
 *
 * Run: npx tsx scripts/verify-wmp-regions.ts
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseSkinManifest, walkElements } from '../src/lib/wmp/skinParser';
import { decodeSkinText } from '../src/lib/wmp/skinSource';
import { parseButtonGroup } from '../src/lib/wmp/regionMapper';
import { resolveLayout } from '../src/lib/wmp/layout';
import { SKINS } from '../src/lib/wmp/skinRegistry';
import type { SkinAssets, SkinDefinition, SkinElement } from '../src/types/wmp';

const failures: string[] = [];

function fail(message: string): void {
  failures.push(message);
}

/** Read a manifest off disk exactly as the browser loader would decode it. */
function readManifest(skinId: string, manifest: string): string {
  const bytes = readFileSync(
    join(__dirname, '..', 'public', 'assets', 'skins', skinId, manifest)
  );
  return decodeSkinText(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  );
}

function collect(definition: SkinDefinition): SkinElement[] {
  const all: SkinElement[] = [];
  walkElements(definition.view.elements, (element) => all.push(element));
  return all;
}

/** Every registered skin must parse into something renderable. */
function checkSkinParses(skinId: string, manifest: string): SkinDefinition | null {
  let definition: SkinDefinition;

  try {
    definition = parseSkinManifest(readManifest(skinId, manifest));
  } catch (error) {
    fail(`[${skinId}] failed to parse: ${(error as Error).message}`);
    return null;
  }

  if (definition.view.width <= 0 || definition.view.height <= 0) {
    fail(
      `[${skinId}] main view has no size (${definition.view.width}x${definition.view.height})`
    );
  }

  const elements = collect(definition);
  if (elements.length === 0) {
    fail(`[${skinId}] parsed zero elements`);
  }

  const hasTransport = elements.some(
    (element) => element.type === 'playelement' || element.type === 'pausebutton'
  );
  if (!hasTransport) {
    fail(`[${skinId}] no play/pause element found`);
  }

  console.log(
    `[${skinId}] theme=${JSON.stringify(definition.theme.id)} ` +
      `views=${definition.views.length} ` +
      `size=${definition.view.width}x${definition.view.height} ` +
      `elements=${elements.length}`
  );

  return definition;
}

/**
 * `jscript:` positions must resolve to real coordinates.
 *
 * Runs with an empty asset map, so expressions depending on an image's natural
 * size stay unresolved here; those are reported rather than failed. What must
 * hold is that sibling-geometry arithmetic resolves at all, since the
 * pre-interpreter renderer collapsed every one of these to 0.
 */
function checkLayoutResolves(skinId: string, definition: SkinDefinition): void {
  const expressions: Array<{ element: SkinElement; axis: 'left' | 'top' }> = [];

  walkElements(definition.view.elements, (element) => {
    for (const axis of ['left', 'top'] as const) {
      if (typeof element.position[axis] === 'string') {
        expressions.push({ element, axis });
      }
    }
  });

  if (expressions.length === 0) {
    console.log(`[${skinId}] no jscript positions`);
    return;
  }

  const emptyAssets: SkinAssets = { images: new Map(), mappings: new Map() };
  resolveLayout(definition, emptyAssets);

  // An expression that resolved produces a coordinate; one that did not falls
  // back to 0, which is also what the old renderer produced for all of them.
  const resolved = expressions.filter(
    ({ element, axis }) => (element.resolved?.[axis] ?? 0) !== 0
  ).length;

  console.log(
    `[${skinId}] jscript positions: ${resolved}/${expressions.length} resolved to a coordinate`
  );

  if (resolved === 0) {
    fail(`[${skinId}] no jscript position resolved; layout evaluation is broken`);
  }
}

/** SOR-155: headspace's buttongroup regions must each resolve a handler. */
function checkHeadspaceRegions(definition: SkinDefinition): void {
  // The exact keys WMPPlayer.createClickHandlers registers.
  const handlers = new Map<string, () => void>(
    ['playelement', 'stopelement', 'nextelement', 'prevelement', 'minimize', 'close'].map(
      (key) => [key, () => {}]
    )
  );

  // Bounds scanning is irrelevant to id/handler resolution; empty pixel data
  // makes calculateColorBounds a no-op.
  const stubImageData = {
    width: 0,
    height: 0,
    data: new Uint8ClampedArray(0),
  } as ImageData;

  const groups: SkinElement[] = [];
  walkElements(definition.view.elements, (element) => {
    if (element.type === 'buttongroup') groups.push(element);
  });

  const regions = groups.flatMap((group) =>
    parseButtonGroup(group, stubImageData, handlers)
  );

  console.log('headspace regions:');
  for (const region of regions) {
    console.log(
      `  id=${JSON.stringify(region.id)} ` +
        `toolTip=${JSON.stringify(region.toolTip)} ` +
        `handler=${region.onClick ? 'YES' : 'NO'}`
    );
  }

  for (const want of [
    'minimize',
    'close',
    'playelement',
    'stopelement',
    'nextelement',
    'prevelement',
  ]) {
    const region = regions.find((candidate) => candidate.id === want);
    if (!region) fail(`no region with id "${want}"`);
    else if (!region.onClick) fail(`region "${want}" has no click handler`);
  }

  const ids = regions.map((region) => region.id);
  const dupes = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (dupes.length) fail(`colliding region ids: ${JSON.stringify(dupes)}`);
}

function main(): void {
  for (const skin of SKINS) {
    const definition = checkSkinParses(skin.id, skin.manifest);
    if (!definition) continue;

    checkLayoutResolves(skin.id, definition);

    if (skin.id === 'headspace') {
      checkHeadspaceRegions(definition);
    }
  }

  if (failures.length) {
    console.error('RED:');
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  console.log('GREEN: every registered skin parses and headspace regions resolve');
}

main();
