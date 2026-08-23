/**
 * Windows Media Player skin parser.
 *
 * Turns a `.wms` manifest into a `SkinDefinition`. The work splits three ways:
 *
 *   skinSource.ts      bytes -> text (BOM sniffing, windows-1252 default)
 *   wmsDocument.ts     text  -> node tree (tolerant SGML, not XML)
 *   this file          nodes -> SkinDefinition (via the attribute schema)
 *
 * Nothing here is specific to any one skin. Element and attribute support
 * lives in `attributeSchema.ts` as data, so a skin that uses an attribute no
 * other skin uses is a table row rather than a new branch.
 */

import type {
  SkinDefinition,
  SkinElement,
  SkinElementType,
  SkinTheme,
  SkinView,
} from '@/types/wmp';
import {
  ATTRIBUTE_SCHEMA,
  ELEMENT_TAGS,
  NON_VISUAL_TAGS,
  specFor,
  type Coercion,
} from './attributeSchema';
import { parseAttributeExpression } from './expression';
import { fetchSkinText } from './skinSource';
import { parseWmsDocument, findFirst, type WmsNode } from './wmsDocument';

/** Assign into a dotted path, creating intermediate objects as needed. */
function assignPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split('.');
  let cursor = target;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    if (typeof cursor[segment] !== 'object' || cursor[segment] === null) {
      cursor[segment] = {};
    }
    cursor = cursor[segment] as Record<string, unknown>;
  }

  cursor[segments[segments.length - 1]] = value;
}

/**
 * Apply a coercion. Returns `undefined` for values that should not be set at
 * all, which keeps unparseable numbers from becoming NaN in the tree.
 */
function coerce(raw: string, kind: Coercion): unknown {
  switch (kind) {
    case 'string':
      return raw;

    case 'int': {
      const parsed = parseInt(raw, 10);
      return Number.isNaN(parsed) ? undefined : parsed;
    }

    case 'boolean':
      return raw.toLowerCase() === 'true';

    case 'numberOrBinding': {
      // A binding keeps its source text; the renderer resolves it live.
      if (parseAttributeExpression(raw).kind !== 'literal') return raw;
      const parsed = parseFloat(raw);
      return Number.isNaN(parsed) ? raw : parsed;
    }

    case 'position': {
      // `jscript:` arithmetic is preserved verbatim and resolved by
      // `resolveLayout` once image dimensions are known.
      if (parseAttributeExpression(raw).kind !== 'literal') return raw;
      const parsed = parseInt(raw, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }

    case 'booleanOrBinding': {
      if (parseAttributeExpression(raw).kind !== 'literal') return raw;
      return raw.toLowerCase() === 'true';
    }

    default:
      return raw;
  }
}

/**
 * Convert one WMS node into a SkinElement, recursing into its children.
 * Returns null for tags that carry no UI.
 */
export function parseElement(node: WmsNode): SkinElement | null {
  const mapping = ELEMENT_TAGS[node.tag];
  if (!mapping) {
    // Settings tags and anything unrecognised contribute nothing to render.
    return null;
  }

  const element: SkinElement = {
    type: mapping.type,
    position: { left: 0, top: 0 },
    dimensions: {},
    images: {},
    colors: {},
    children: [],
  };

  if (mapping.role) {
    element.role = mapping.role;
  }

  for (const [name, value] of node.attrs) {
    const spec = specFor(name, mapping.type);
    if (!spec) continue;

    const coerced = coerce(value, spec.coerce);
    if (coerced !== undefined) {
      assignPath(element as unknown as Record<string, unknown>, spec.target, coerced);
    }
  }

  /*
   * A tag whose name is itself the binding (`<currentPositionText>`) supplies
   * one only when the element did not declare a value of its own.
   */
  if (mapping.implicitBinding && element.textValue === undefined) {
    element.textValue = mapping.implicitBinding;
  }

  for (const child of node.children) {
    const parsed = parseElement(child);
    if (parsed) {
      element.children!.push(parsed);
    }
  }

  return element;
}

/** Parse a single `<view>` node. */
function parseView(node: WmsNode): SkinView {
  const view: SkinView = {
    id: node.attrs.get('id'),
    width: parseInt(node.attrs.get('width') ?? '0', 10) || 0,
    height: parseInt(node.attrs.get('height') ?? '0', 10) || 0,
    backgroundColor: node.attrs.get('backgroundcolor'),
    titleBar: node.attrs.get('titlebar') === 'true',
    resizable:
      node.attrs.get('resizable') === 'true' || node.attrs.get('resizeable') === 'true',
    scriptFile: node.attrs.get('scriptfile'),
    elements: [],
  };

  for (const child of node.children) {
    const parsed = parseElement(child);
    if (parsed) {
      view.elements.push(parsed);
    }
  }

  return view;
}

/** Collect every `<view>` descendant in document order. */
function collectViews(node: WmsNode, into: WmsNode[] = []): WmsNode[] {
  for (const child of node.children) {
    if (child.tag === 'view') {
      into.push(child);
      // A <view> never nests another, so no need to descend further.
      continue;
    }
    collectViews(child, into);
  }
  return into;
}

/**
 * Parse manifest text into a skin definition.
 *
 * @throws when the manifest has no `<theme>` or no `<view>`, which are the two
 *   things every WMS must have for the player to show anything.
 */
export function parseSkinManifest(source: string): SkinDefinition {
  const document = parseWmsDocument(source);

  const themeNode = findFirst(document, 'theme');
  if (!themeNode) {
    throw new Error('Invalid skin manifest: no <theme> element');
  }

  const theme: SkinTheme = {
    id: themeNode.attrs.get('id') ?? 'unknown',
    title: themeNode.attrs.get('title'),
    author: themeNode.attrs.get('author'),
    copyright: themeNode.attrs.get('copyright'),
  };

  const viewNodes = collectViews(themeNode);
  if (viewNodes.length === 0) {
    throw new Error('Invalid skin manifest: no <view> element');
  }

  const views = viewNodes.map(parseView);

  return { theme, view: views[0], views };
}

/** Fetch and parse a skin manifest. */
export async function loadSkin(manifestUrl: string): Promise<SkinDefinition> {
  return parseSkinManifest(await fetchSkinText(manifestUrl));
}

/** Depth-first search for an element by id. */
export function findElementById(
  skinDef: SkinDefinition,
  id: string
): SkinElement | null {
  function search(elements: SkinElement[]): SkinElement | null {
    for (const element of elements) {
      if (element.id === id) return element;
      const found = element.children ? search(element.children) : null;
      if (found) return found;
    }
    return null;
  }

  return search(skinDef.view.elements);
}

/** Every element of a given type, depth-first. */
export function getElementsByType(
  skinDef: SkinDefinition,
  type: SkinElementType
): SkinElement[] {
  const results: SkinElement[] = [];

  function search(elements: SkinElement[]): void {
    for (const element of elements) {
      if (element.type === type) results.push(element);
      if (element.children) search(element.children);
    }
  }

  search(skinDef.view.elements);
  return results;
}

/** Walk every element in a view, depth-first. */
export function walkElements(
  elements: SkinElement[],
  visit: (element: SkinElement) => void
): void {
  for (const element of elements) {
    visit(element);
    if (element.children) walkElements(element.children, visit);
  }
}

/** Re-exported so callers do not need to know about the schema module. */
export { ATTRIBUTE_SCHEMA };
