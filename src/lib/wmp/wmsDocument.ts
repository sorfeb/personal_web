/**
 * Tolerant tokenizer for the Windows Media Player skin format (.wms).
 *
 * WMS is SGML, not XML, and the shipped skins rely on it. Two real examples
 * from the skins in `public/assets/skins`:
 *
 *   cerulean.wms  <subview id="vScrLeft" left="42" top="145" left="11" top="0">
 *                 duplicate `left`/`top` on one tag
 *   MediaBay.wms  <buttongroup> ... </buttonGroup>
 *                 close tag differs in case from its open tag
 *
 * A strict `DOMParser(text/xml)` rejects both. `DOMParser(text/html)` accepts
 * them but drags in the HTML content model (`<video>`, `<button>` and `<text>`
 * all carry parsing rules WMS does not want) and only exists in a browser.
 *
 * So we tokenize ourselves. The grammar is small: tags, attributes, comments,
 * and whitespace. Recovery rules match HTML's, because that is what authors
 * of the era were testing against:
 *
 *   - tag and attribute names fold to lowercase
 *   - a duplicate attribute keeps the FIRST occurrence
 *   - a close tag matches its nearest open ancestor case-insensitively
 *   - a close tag with no matching ancestor is discarded
 *   - tags left open at EOF are closed implicitly
 */

export interface WmsNode {
  /** Tag name, lowercased. */
  tag: string;
  /** Attributes, lowercased keys, first occurrence wins. */
  attrs: Map<string, string>;
  children: WmsNode[];
}

/** Matches one `name="value"` / `name='value'` / `name=value` / bare `name` pair. */
const ATTR_PATTERN =
  /([A-Za-z_:][-A-Za-z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/**
 * Expand the entity subset WMS actually uses. Unknown entities are left
 * verbatim rather than dropped, so a stray `&` in a script attribute survives.
 */
function decodeEntities(value: string): string {
  if (!value.includes('&')) return value;

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body.startsWith('#')) {
      const codePoint = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(codePoint) && codePoint > 0
        ? String.fromCodePoint(codePoint)
        : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

/**
 * Pull the attributes out of a tag's interior (everything after the tag name
 * and before the closing `>`), keeping the first value for repeated names.
 */
function parseAttributes(source: string): Map<string, string> {
  const attrs = new Map<string, string>();

  ATTR_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ATTR_PATTERN.exec(source)) !== null) {
    const name = match[1].toLowerCase();
    // A bare attribute (`sticky`) is HTML-style boolean true.
    const raw = match[2] ?? match[3] ?? match[4] ?? 'true';

    // First occurrence wins, matching the HTML parser.
    if (!attrs.has(name)) {
      attrs.set(name, decodeEntities(raw));
    }
  }

  return attrs;
}

/**
 * Find the `>` that ends a tag, ignoring any inside a quoted attribute value.
 *
 * No skin in the current corpus puts `>` in an attribute, but script-bearing
 * attributes (`onClick="if (a > b) ..."`) are exactly where one would appear,
 * and a naive scan would truncate the tag and swallow the rest of its
 * attributes silently.
 */
function findTagEnd(source: string, from: number): number {
  let quote: '"' | "'" | null = null;

  for (let i = from; i < source.length; i += 1) {
    const char = source[i];

    if (quote) {
      if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '>') return i;
  }

  return -1;
}

/**
 * Parse WMS source into a node tree.
 *
 * Always returns a synthetic `#document` root, so a skin with leading comments
 * or more than one top-level tag still produces a usable tree.
 */
export function parseWmsDocument(source: string): WmsNode {
  const root: WmsNode = { tag: '#document', attrs: new Map(), children: [] };
  const stack: WmsNode[] = [root];

  let cursor = 0;

  while (cursor < source.length) {
    const open = source.indexOf('<', cursor);
    if (open === -1) break;

    // Comments, doctypes and processing instructions carry no UI meaning.
    if (source.startsWith('<!--', open)) {
      const end = source.indexOf('-->', open + 4);
      cursor = end === -1 ? source.length : end + 3;
      continue;
    }
    if (source.startsWith('<!', open) || source.startsWith('<?', open)) {
      const end = source.indexOf('>', open + 2);
      cursor = end === -1 ? source.length : end + 1;
      continue;
    }

    const close = findTagEnd(source, open + 1);
    if (close === -1) break;

    const isCloseTag = source[open + 1] === '/';
    const body = source.slice(open + (isCloseTag ? 2 : 1), close);
    const nameMatch = /^\s*([A-Za-z_:][-A-Za-z0-9_:.]*)/.exec(body);

    // `< ` that isn't a tag start — skip the bracket and carry on.
    if (!nameMatch) {
      cursor = open + 1;
      continue;
    }

    const tag = nameMatch[1].toLowerCase();
    cursor = close + 1;

    if (isCloseTag) {
      // Walk up to the nearest open ancestor with this name. Anything opened
      // below it was left unclosed, so close it implicitly. Index 0 is the
      // synthetic root, so a miss leaves the stack untouched and the stray
      // close tag is discarded.
      for (let depth = stack.length - 1; depth > 0; depth -= 1) {
        if (stack[depth].tag === tag) {
          stack.length = depth;
          break;
        }
      }
      continue;
    }

    const selfClosing = body.trimEnd().endsWith('/');
    const attrSource = selfClosing
      ? body.slice(nameMatch[0].length, body.lastIndexOf('/'))
      : body.slice(nameMatch[0].length);

    const node: WmsNode = {
      tag,
      attrs: parseAttributes(attrSource),
      children: [],
    };

    stack[stack.length - 1].children.push(node);

    if (!selfClosing) {
      stack.push(node);
    }
  }

  return root;
}

/** First descendant with the given (lowercase) tag, depth-first. */
export function findFirst(node: WmsNode, tag: string): WmsNode | null {
  for (const child of node.children) {
    if (child.tag === tag) return child;
    const nested = findFirst(child, tag);
    if (nested) return nested;
  }
  return null;
}

/** Direct children with the given (lowercase) tag. */
export function childrenNamed(node: WmsNode, tag: string): WmsNode[] {
  return node.children.filter((child) => child.tag === tag);
}
