/**
 * Attribute expression handling for WMS skins.
 *
 * Four prefixes appear in attribute values across the shipped skins:
 *
 *   jscript:balance.left+3        arithmetic against another element's geometry
 *   wmpprop:player.controls.currentPosition    two-way bind to the player model
 *   wmpenabled:player.controls.play            bind to a model capability
 *   wmpdisabled:...                            its inverse
 *
 * The `jscript:` values are the interesting ones. In real WMP they were fed to
 * a JScript engine, but in practice skin authors used them for one thing:
 * positioning an element relative to a sibling. Every `jscript:` position in
 * the five skins surveyed fits `path (+|- path|number)*`:
 *
 *   jscript:balance.left+balance.width+10        headspace
 *   jscript:eq1.top+83                           headspace
 *   jscript:plOutline.width                      wood
 *   jscript:Sign1.left+65                        MediaBay
 *   jscript:115                                  MediaBay
 *
 * So we evaluate that grammar directly instead of hosting a script engine.
 * It is total, side-effect free, and needs no CSP relaxation. Anything outside
 * the grammar (assignments, calls, `?:`) returns null and the caller falls
 * back, which keeps this honest rather than silently wrong.
 */

export type ExpressionKind =
  | 'literal'
  | 'jscript'
  | 'wmpprop'
  | 'wmpenabled'
  | 'wmpdisabled';

export interface AttributeExpression {
  kind: ExpressionKind;
  /** The text after the prefix, trimmed, with any trailing `;` removed. */
  source: string;
}

const PREFIXES: Array<[string, ExpressionKind]> = [
  ['jscript:', 'jscript'],
  ['wmpprop:', 'wmpprop'],
  ['wmpenabled:', 'wmpenabled'],
  ['wmpdisabled:', 'wmpdisabled'],
];

/**
 * Classify a raw attribute value by prefix. Prefixes are matched
 * case-insensitively because the skins are inconsistent about it
 * (`wmpprop:player.Controls.currentPosition` in MediaBay.wms).
 */
export function parseAttributeExpression(raw: string): AttributeExpression {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  for (const [prefix, kind] of PREFIXES) {
    if (lower.startsWith(prefix)) {
      return {
        kind,
        source: trimmed.slice(prefix.length).trim().replace(/;+\s*$/, ''),
      };
    }
  }

  return { kind: 'literal', source: trimmed };
}

/** Resolves a dotted path such as `balance.left` to a number, or null if unknown. */
export type PathResolver = (path: string) => number | null;

type Token =
  | { type: 'number'; value: number }
  | { type: 'path'; value: string }
  | { type: 'op'; value: '+' | '-' };

/**
 * Tokenize the layout subset. Returns null the moment anything outside the
 * grammar appears, so callers can distinguish "evaluated to 0" from
 * "not a layout expression".
 */
function tokenize(source: string): Token[] | null {
  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const char = source[cursor];

    if (/\s/.test(char)) {
      cursor += 1;
      continue;
    }

    if (char === '+' || char === '-') {
      tokens.push({ type: 'op', value: char });
      cursor += 1;
      continue;
    }

    const number = /^\d+(?:\.\d+)?/.exec(source.slice(cursor));
    if (number) {
      tokens.push({ type: 'number', value: parseFloat(number[0]) });
      cursor += number[0].length;
      continue;
    }

    const path = /^[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*/.exec(
      source.slice(cursor)
    );
    if (path) {
      tokens.push({ type: 'path', value: path[0] });
      cursor += path[0].length;
      continue;
    }

    // `=`, `(`, `?`, string literals: outside the grammar.
    return null;
  }

  return tokens.length > 0 ? tokens : null;
}

/**
 * Evaluate a `jscript:` layout expression.
 *
 * Returns null when the expression is not pure arithmetic, or when a path it
 * depends on is still unresolved. Callers treat both as "try again later or
 * fall back", which is what makes the fixpoint pass in `layout.ts` work.
 */
export function evaluateLayoutExpression(
  source: string,
  resolve: PathResolver
): number | null {
  const tokens = tokenize(source);
  if (!tokens) return null;

  // Expression must alternate term, op, term, ... starting and ending on a term.
  let total = 0;
  let sign = 1;
  let expectTerm = true;

  for (const token of tokens) {
    if (expectTerm) {
      if (token.type === 'op') {
        // A leading or doubled sign: fold it in rather than rejecting.
        sign = token.value === '-' ? -sign : sign;
        continue;
      }

      const value = token.type === 'number' ? token.value : resolve(token.value);
      if (value === null) return null;

      total += sign * value;
      sign = 1;
      expectTerm = false;
      continue;
    }

    if (token.type !== 'op') return null;
    sign = token.value === '-' ? -1 : 1;
    expectTerm = true;
  }

  return expectTerm ? null : total;
}

/**
 * Read a dotted, case-insensitive path out of a plain object graph.
 * Used for `wmpprop:` / `wmpenabled:` lookups against the player model, where
 * skins disagree on casing for the same member.
 */
export function readModelPath(
  model: Record<string, unknown>,
  path: string
): unknown {
  let current: unknown = model;

  for (const segment of path.split('.')) {
    if (current === null || typeof current !== 'object') return undefined;

    const record = current as Record<string, unknown>;
    const key = Object.keys(record).find(
      (candidate) => candidate.toLowerCase() === segment.toLowerCase()
    );
    if (key === undefined) return undefined;

    current = record[key];
  }

  return current;
}
