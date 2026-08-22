/**
 * Resolves `jscript:` geometry expressions to pixel values.
 *
 * Skins position elements relative to each other by id:
 *
 *   <slider id="balance" left="34" top="118" />
 *   <text left="jscript:balance.left+3" top="jscript:balance.top+33" />
 *
 * Before this pass, `WMPSubview` threw those away and rendered at 0,0. The
 * references form a DAG in practice but may point forward as well as back, so
 * rather than topologically sorting we iterate to a fixpoint: cheap at this
 * size (low hundreds of elements) and immune to declaration order.
 *
 * An element whose position never resolves keeps `resolved` unset, and the
 * renderer falls back to 0. That is the same place the old code landed, except
 * now it is the exception rather than every expression.
 */

import type { SkinAssets, SkinDefinition, SkinElement } from '@/types/wmp';
import { evaluateLayoutExpression, parseAttributeExpression } from './expression';
import { walkElements } from './skinParser';

/** Cap on fixpoint passes. A chain longer than this is a cycle, not a depth. */
const MAX_PASSES = 12;

type Axis = 'left' | 'top';

interface Geometry {
  left: number | null;
  top: number | null;
  width: number | null;
  height: number | null;
}

/**
 * An element's rendered size: the explicit attribute when present, otherwise
 * the natural size of whichever image it draws.
 */
function intrinsicSize(
  element: SkinElement,
  assets: SkinAssets
): { width: number | null; height: number | null } {
  const explicitWidth = element.dimensions?.width ?? null;
  const explicitHeight = element.dimensions?.height ?? null;
  if (explicitWidth !== null && explicitHeight !== null) {
    return { width: explicitWidth, height: explicitHeight };
  }

  const filename = element.images?.background ?? element.images?.default;
  const image = filename ? assets.images.get(filename) : undefined;

  return {
    width: explicitWidth ?? image?.width ?? null,
    height: explicitHeight ?? image?.height ?? null,
  };
}

/**
 * Resolve every element position in the definition, mutating `element.resolved`.
 *
 * Call after assets load: expressions like `balance.left+balance.width+10`
 * need image dimensions, which are only known once the bitmaps are decoded.
 */
export function resolveLayout(definition: SkinDefinition, assets: SkinAssets): void {
  for (const view of definition.views) {
    resolveView(view.elements, assets);
  }
}

function resolveView(elements: SkinElement[], assets: SkinAssets): void {
  const geometry = new Map<string, Geometry>();
  const pending: Array<{ element: SkinElement; axis: Axis; source: string }> = [];

  // Seed: literal positions and intrinsic sizes are known immediately.
  walkElements(elements, (element) => {
    const size = intrinsicSize(element, assets);
    const entry: Geometry = { left: null, top: null, ...size };

    for (const axis of ['left', 'top'] as Axis[]) {
      const raw = element.position[axis];

      if (typeof raw === 'number') {
        entry[axis] = raw;
        continue;
      }

      const expression = parseAttributeExpression(String(raw));
      if (expression.kind === 'jscript') {
        pending.push({ element, axis, source: expression.source });
      } else {
        // A non-jscript string in a position slot: treat as 0, same as WMP.
        entry[axis] = 0;
      }
    }

    if (element.id) {
      geometry.set(element.id, entry);
    }

    element.resolved = {
      left: entry.left ?? 0,
      top: entry.top ?? 0,
    };
  });

  const resolvePath = (path: string): number | null => {
    const dot = path.lastIndexOf('.');
    if (dot === -1) return null;

    const entry = geometry.get(path.slice(0, dot));
    if (!entry) return null;

    const property = path.slice(dot + 1).toLowerCase();
    if (property === 'left') return entry.left;
    if (property === 'top') return entry.top;
    if (property === 'width') return entry.width;
    if (property === 'height') return entry.height;
    return null;
  };

  // Fixpoint: keep sweeping the unresolved list until a pass changes nothing.
  let unresolved = pending;

  for (let pass = 0; pass < MAX_PASSES && unresolved.length > 0; pass += 1) {
    const stillUnresolved: typeof unresolved = [];

    for (const item of unresolved) {
      const value = evaluateLayoutExpression(item.source, resolvePath);

      if (value === null) {
        stillUnresolved.push(item);
        continue;
      }

      item.element.resolved![item.axis] = value;

      if (item.element.id) {
        const entry = geometry.get(item.element.id);
        if (entry) entry[item.axis] = value;
      }
    }

    if (stillUnresolved.length === unresolved.length) {
      // No progress: the remainder is cyclic or outside the grammar.
      break;
    }
    unresolved = stillUnresolved;
  }
}
