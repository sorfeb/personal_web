/**
 * Declarative WMS attribute and element tables.
 *
 * The previous parser hand-wrote roughly forty `if (element.hasAttribute(...))`
 * branches, which meant every skin that used an attribute headspace happened
 * not to use was silently dropped. These tables are the whole mapping, so
 * supporting a new attribute is a row rather than a code path.
 */

import type { SkinElementType, SliderRole } from '@/types/wmp';

/**
 * WMS tag -> our element type, plus an optional role.
 *
 * WMP grew several spellings for the same widget over its lifetime
 * (`<pausebutton>` and `<pauseelement>`; `<slider>`, `<seekslider>` and
 * `<volumeslider>`). Collapsing them here means the renderer branches on one
 * type and the role carries the binding hint.
 */
export interface ElementTagSpec {
  type: SkinElementType;
  role?: SliderRole;
  /**
   * Binding a tag implies by its own name. `<currentPositionText>` displays
   * the playback position without declaring a `value`, so the tag itself is
   * the binding. Applied only when the element declares no explicit value.
   */
  implicitBinding?: string;
}

/**
 * Covers every tag used by the five skins in the legacy archive, which is the
 * corpus this parser is checked against. A tag absent from both this table and
 * NON_VISUAL_TAGS contributes nothing to the render.
 */
export const ELEMENT_TAGS: Record<string, ElementTagSpec> = {
  button: { type: 'button' },
  buttongroup: { type: 'buttongroup' },
  buttonelement: { type: 'buttonelement' },
  imagebutton: { type: 'button' },
  returnbutton: { type: 'button' },
  shufflebutton: { type: 'button' },

  playelement: { type: 'playelement' },
  pausebutton: { type: 'pausebutton' },
  pauseelement: { type: 'pausebutton' },
  stopelement: { type: 'stopelement' },
  nextelement: { type: 'nextelement' },
  prevelement: { type: 'prevelement' },

  // Scrub transport. Rendered, but inert until scripts run: their behaviour
  // lives in onClick handlers rather than in the tag semantics.
  ffwdelement: { type: 'button' },
  ffwdbutton: { type: 'button' },
  rewelement: { type: 'button' },
  rewbutton: { type: 'button' },

  slider: { type: 'slider' },
  seekslider: { type: 'slider', role: 'seek' },
  volumeslider: { type: 'slider', role: 'volume' },
  balanceslider: { type: 'slider', role: 'balance' },

  text: { type: 'text' },
  statustext: { type: 'text' },
  currentpositiontext: {
    type: 'text',
    implicitBinding: 'wmpprop:player.controls.currentPositionString',
  },

  subview: { type: 'subview' },
  effects: { type: 'effects' },
  video: { type: 'video' },
  playlist: { type: 'playlist' },
  itemsplaylist: { type: 'playlist' },
  dropdownplaylist: { type: 'playlist' },
};

/**
 * Tags that carry settings rather than pixels. Listing them explicitly keeps
 * them out of the "unknown tag" bucket, so a genuinely unrecognised tag stays
 * visible during development instead of hiding among the expected skips.
 */
export const NON_VISUAL_TAGS = new Set([
  'player',
  'network',
  'controls',
  'settings',
  'equalizersettings',
  'videosettings',
  'wmpeffects',
  'wmpvideo',
  'theme',
  'view',
  // A menu surface WMP raised on demand. Nothing to draw inline.
  'popup',
]);

export type Coercion =
  /** Verbatim string. */
  | 'string'
  /** Integer, dropped when unparseable. */
  | 'int'
  /** `"true"` (or a bare attribute) is true, anything else false. */
  | 'boolean'
  /** A number, or the raw string when it carries a `wmpprop:`-style prefix. */
  | 'numberOrBinding'
  /** A number, or the raw string when it is a `jscript:` expression. */
  | 'position'
  /** A boolean, or the raw string when it carries a binding prefix. */
  | 'booleanOrBinding';

export interface AttributeSpec {
  /** Dotted path on the SkinElement to assign into. */
  target: string;
  coerce: Coercion;
  /** When present, this row applies only to these element types. */
  only?: SkinElementType[];
}

/**
 * Attribute name (lowercased) -> where it lands.
 *
 * An array means the mapping is element-type dependent; the first row whose
 * `only` matches wins, and a row without `only` acts as the default.
 */
export const ATTRIBUTE_SCHEMA: Record<string, AttributeSpec | AttributeSpec[]> = {
  id: { target: 'id', coerce: 'string' },

  // Geometry. `left`/`top` are the attributes that carry jscript arithmetic.
  left: { target: 'position.left', coerce: 'position' },
  top: { target: 'position.top', coerce: 'position' },
  zindex: { target: 'position.zIndex', coerce: 'int' },
  width: { target: 'dimensions.width', coerce: 'int' },
  height: { target: 'dimensions.height', coerce: 'int' },

  // Images.
  image: { target: 'images.default', coerce: 'string' },
  hoverimage: { target: 'images.hover', coerce: 'string' },
  downimage: { target: 'images.down', coerce: 'string' },
  disabledimage: { target: 'images.disabled', coerce: 'string' },
  mappingimage: { target: 'images.mapping', coerce: 'string' },
  backgroundimage: { target: 'images.background', coerce: 'string' },
  foregroundimage: { target: 'images.foreground', coerce: 'string' },
  thumbimage: { target: 'images.thumb', coerce: 'string' },
  thumbhoverimage: { target: 'images.thumbHover', coerce: 'string' },
  thumbdownimage: { target: 'images.thumbDown', coerce: 'string' },

  // Colors.
  backgroundcolor: { target: 'colors.backgroundColor', coerce: 'string' },
  foregroundcolor: { target: 'colors.foregroundColor', coerce: 'string' },
  transparencycolor: { target: 'colors.transparencyColor', coerce: 'string' },
  clippingcolor: { target: 'colors.clippingColor', coerce: 'string' },
  mappingcolor: { target: 'mappingColor', coerce: 'string' },

  // Slider.
  min: { target: 'min', coerce: 'numberOrBinding' },
  max: { target: 'max', coerce: 'numberOrBinding' },
  direction: { target: 'direction', coerce: 'string' },
  slide: { target: 'slide', coerce: 'boolean' },
  bordersize: { target: 'borderSize', coerce: 'int' },
  tiled: { target: 'tiled', coerce: 'boolean' },
  useforegroundprogress: { target: 'useForegroundProgress', coerce: 'boolean' },
  foregroundprogress: { target: 'foregroundProgress', coerce: 'string' },

  /*
   * `value` is the one genuinely overloaded attribute: a caption on <text>,
   * a bound quantity on <slider>.
   */
  value: [
    { target: 'textValue', coerce: 'string', only: ['text'] },
    { target: 'value', coerce: 'numberOrBinding' },
  ],

  // Text.
  fontsize: { target: 'fontSize', coerce: 'int' },
  fontstyle: { target: 'fontStyle', coerce: 'string' },
  fonttype: { target: 'fontType', coerce: 'string' },
  justification: { target: 'justification', coerce: 'string' },
  cursor: { target: 'cursor', coerce: 'string' },

  // Playlist.
  columnsvisible: { target: 'columnsVisible', coerce: 'boolean' },
  columns: { target: 'columns', coerce: 'string' },
  dropdownvisible: { target: 'dropDownVisible', coerce: 'boolean' },
  playlistitemsvisible: { target: 'playlistItemsVisible', coerce: 'boolean' },

  // State.
  visible: { target: 'visible', coerce: 'booleanOrBinding' },
  enabled: { target: 'enabled', coerce: 'booleanOrBinding' },
  sticky: { target: 'sticky', coerce: 'boolean' },

  // Tooltips. WMP used `uptooltip` on buttongroup members.
  tooltip: { target: 'toolTip', coerce: 'string' },
  uptooltip: { target: 'toolTip', coerce: 'string' },

  // Scripts. Kept as source; only `onclick` is currently acted on.
  onclick: { target: 'onClick', coerce: 'string' },
  ondragend: { target: 'onDragEnd', coerce: 'string' },
  onendmove: { target: 'onEndMove', coerce: 'string' },
  onload: { target: 'onLoad', coerce: 'string' },
  onclose: { target: 'onClose', coerce: 'string' },
  onvideostart: { target: 'onVideoStart', coerce: 'string' },
  onvideoend: { target: 'onVideoEnd', coerce: 'string' },
  value_onchange: { target: 'value_onchange', coerce: 'string' },
};

/** Pick the schema row that applies to a given element type. */
export function specFor(
  attribute: string,
  elementType: SkinElementType
): AttributeSpec | null {
  const entry = ATTRIBUTE_SCHEMA[attribute];
  if (!entry) return null;
  if (!Array.isArray(entry)) return entry;

  return (
    entry.find((spec) => spec.only?.includes(elementType)) ??
    entry.find((spec) => !spec.only) ??
    null
  );
}
