# WMP skin interpreter

Replaces the headspace-specific skin parser with a generic WMS interpreter, and
adds skin switching. Cerulean ships as the second installed skin.

## What changed

The previous parser assumed one skin. It hardcoded the manifest filename,
parsed strict XML with case-sensitive lookups, hand-wrote ~40 `hasAttribute`
branches, discarded every `jscript:` position, and colour-keyed magenta and red
out of every image. Each of those was headspace's shape rather than the format's.

The pipeline is now four layers, none of them skin-specific:

| Layer | File | Job |
|---|---|---|
| Bytes | `src/lib/wmp/skinSource.ts` | BOM sniff, `TextDecoder`, windows-1252 default |
| Tokens | `src/lib/wmp/wmsDocument.ts` | Tolerant SGML parse to a node tree |
| Model | `src/lib/wmp/skinParser.ts` + `attributeSchema.ts` | Nodes to `SkinDefinition` via lookup tables |
| Geometry | `src/lib/wmp/layout.ts` + `expression.ts` | `jscript:` arithmetic to pixels |

Supporting a new attribute or tag is a table row in `attributeSchema.ts`.
Installing a skin is a folder under `public/assets/skins/` plus a row in
`skinRegistry.ts`.

### Why the parse is hand-written

WMS is SGML, not XML. Two of the five skins surveyed are not well-formed XML:

- `cerulean.wms` repeats `left`/`top` on one `<subview>` tag
- `MediaBay.wms` opens `<buttongroup>` and closes `</buttonGroup>`

`DOMParser(text/xml)` rejects both. `DOMParser(text/html)` accepts them but
applies the HTML content model to `<video>`, `<button>` and `<text>`, and only
exists in a browser. The tokenizer follows HTML's recovery rules (first
duplicate attribute wins, close tags match case-insensitively, unclosed tags
close at EOF) in about 150 lines, and runs under Node so the harness can use it.

### Why there is no script engine

`scriptFile` is real JavaScript that mutates the UI imperatively, and hosting it
needs a mutable element model plus CSP `unsafe-eval`. It is not in this change.

What is here instead: every `jscript:` value used for *positioning* across the
five skins fits `path (+|- path|number)*`, so `expression.ts` evaluates that
grammar directly. It is total, side-effect free, and needs no CSP change.
Anything outside the grammar returns null and the caller falls back, so the
failure mode is visible rather than silently wrong.

### Transparency

`assetLoader` now reads each element's declared `transparencyColor` /
`clippingColor`, inheriting down the tree, and falls back to magenta only for
formats with no alpha channel. The old blanket magenta-and-red key matched
headspace but would have punched holes in any skin whose art contains red.

## Verification

`npx tsx scripts/verify-wmp-regions.ts` (rewritten; the DOMParser shim it used
to need is gone):

```
[headspace] theme="headspace" views=1 size=760x394 elements=66
[headspace] jscript positions: 25/25 resolved to a coordinate
[cerulean]  theme="unknown"   views=1 size=237x412 elements=45
[cerulean]  jscript positions: 13/13 resolved to a coordinate
GREEN: every registered skin parses and headspace regions resolve
```

All 25 of headspace's `jscript:` positions previously rendered at `0,0`.

The three skins *not* installed were parsed as a one-off check of the generic
claim, with no code changes:

| Skin | Manifest | Encoding | Result |
|---|---|---|---|
| 9SeriesDefault | `Corona.wms` | UTF-16LE | 2 views, 859x468, 85 elements |
| Asimov Radio | `MediaBay.wms` | windows-1252 | 1 view, 689x795, 88 elements |
| Halloween | `wood.wms` | UTF-16LE | 4 views, 434x308, 40 elements |

Gates: `typecheck` clean; `lint:useeffect` 0 unapproved; `stylelint` back to the
main baseline exactly (0 errors, 1296 warnings); ESLint back to the 2 pre-existing
`exhaustive-deps` warnings in `WMPPlayer.tsx`.

Not verified: rendered output in a browser. The parse, layout and region layers
are covered by the harness; visual fidelity of cerulean is not.

## Known limitations

- **No script host.** `scriptFile` is parsed out of the manifest and ignored.
  Drawer animations, visualiser toggles and preset buttons that live in skin JS
  are inert. Headspace's drawers still work because they are driven by React
  state keyed on element ids, not by its JS.
- **Only the main view renders.** `definition.views` holds all of them
  (`wood.wms` has four) but detached playlist/equalizer/video windows are not
  drawn.
- **Cerulean is phase 1.** It parses, lays out and renders; its transport
  resolves through the same region mapper. Its equalizer and visualiser
  subviews are inert for the reason above.
- **`PLAYER_DIMENSIONS` is still 760x394**, used for initial centering and drag
  constraints. For cerulean (237x412) the constraint is merely conservative, but
  the centering is off.
- **Unresolved `jscript:` positions fall back to 0.** In Corona and MediaBay a
  portion reference script globals (`BarLeftOffset`, `HovHighlightColor`) that
  only exist once the script host runs.

## Attribution

The installed skins carry third-party copyright: headspace and cerulean are
Microsoft Corporation. `skinRegistry.ts` records a `credit` per skin and the
picker surfaces it, so attribution travels with the art. Redistribution terms
for these files were not resolved as part of this change.
