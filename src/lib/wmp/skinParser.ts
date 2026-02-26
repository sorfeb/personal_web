/**
 * Windows Media Player skin parser
 * Parses .wms XML files and extracts UI definitions
 */

import type {
  SkinDefinition,
  SkinElement,
  SkinElementType,
  SkinTheme,
  SkinView,
} from '@/types/wmp';

/**
 * Parse a WMP skin XML file
 * @param xmlContent - The XML content as a string
 * @returns Parsed skin definition
 */
export async function parseSkinXML(xmlContent: string): Promise<SkinDefinition> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error(`XML parsing error: ${parserError.textContent}`);
  }

  // Parse theme element
  const themeElement = xmlDoc.querySelector('theme');
  if (!themeElement) {
    throw new Error('Invalid skin file: missing <theme> element');
  }

  const theme: SkinTheme = {
    id: themeElement.getAttribute('id') || 'unknown',
    author: themeElement.getAttribute('author') || undefined,
    copyright: themeElement.getAttribute('copyright') || undefined,
  };

  // Parse view element
  const viewElement = themeElement.querySelector('view');
  if (!viewElement) {
    throw new Error('Invalid skin file: missing <view> element');
  }

  const view: SkinView = {
    width: parseInt(viewElement.getAttribute('width') || '0', 10),
    height: parseInt(viewElement.getAttribute('height') || '0', 10),
    backgroundColor: viewElement.getAttribute('backgroundColor') || undefined,
    titleBar: viewElement.getAttribute('titleBar') === 'true',
    resizable: viewElement.getAttribute('resizable') === 'true',
    scriptFile: viewElement.getAttribute('scriptFile') || undefined,
    elements: [],
  };

  // Parse all child elements recursively
  const childElements = Array.from(viewElement.children);
  for (const child of childElements) {
    const element = parseElement(child);
    if (element) {
      view.elements.push(element);
    }
  }

  return {
    theme,
    view,
  };
}

/**
 * Parse a single XML element into a SkinElement
 * @param element - The XML Element to parse
 * @returns Parsed SkinElement or null if element should be skipped
 */
export function parseElement(element: Element): SkinElement | null {
  const tagName = element.tagName.toLowerCase();

  // Map XML tag names to our element types
  const typeMap: Record<string, SkinElementType> = {
    button: 'button',
    buttongroup: 'buttongroup',
    buttonelement: 'buttonelement',
    playelement: 'playelement',
    pausebutton: 'pausebutton',
    stopelement: 'stopelement',
    nextelement: 'nextelement',
    prevelement: 'prevelement',
    slider: 'slider',
    text: 'text',
    subview: 'subview',
    effects: 'effects',
    video: 'video',
    playlist: 'playlist',
  };

  const type = typeMap[tagName];
  if (!type) {
    // Skip elements we don't recognize (like equalizerSettings, etc.)
    return null;
  }

  // Parse common attributes
  const skinElement: SkinElement = {
    type,
    id: element.getAttribute('id') || undefined,
    position: {
      left: parsePosition(element.getAttribute('left') || '0'),
      top: parsePosition(element.getAttribute('top') || '0'),
      zIndex: element.hasAttribute('zIndex')
        ? parseInt(element.getAttribute('zIndex')!, 10)
        : undefined,
    },
    dimensions: {},
    images: {},
    colors: {},
  };

  // Parse dimensions
  if (element.hasAttribute('width')) {
    skinElement.dimensions!.width = parseInt(
      element.getAttribute('width')!,
      10
    );
  }
  if (element.hasAttribute('height')) {
    skinElement.dimensions!.height = parseInt(
      element.getAttribute('height')!,
      10
    );
  }

  // Parse images
  if (element.hasAttribute('image')) {
    skinElement.images!.default = element.getAttribute('image')!;
  }
  if (element.hasAttribute('hoverImage')) {
    skinElement.images!.hover = element.getAttribute('hoverImage')!;
  }
  if (element.hasAttribute('downImage')) {
    skinElement.images!.down = element.getAttribute('downImage')!;
  }
  if (element.hasAttribute('disabledImage')) {
    skinElement.images!.disabled = element.getAttribute('disabledImage')!;
  }
  if (element.hasAttribute('mappingImage')) {
    skinElement.images!.mapping = element.getAttribute('mappingImage')!;
  }
  if (element.hasAttribute('backgroundImage')) {
    skinElement.images!.background = element.getAttribute('backgroundImage')!;
  }
  if (element.hasAttribute('foregroundImage')) {
    skinElement.images!.foreground = element.getAttribute('foregroundImage')!;
  }
  if (element.hasAttribute('thumbImage')) {
    skinElement.images!.thumb = element.getAttribute('thumbImage')!;
  }
  if (element.hasAttribute('thumbHoverImage')) {
    skinElement.images!.thumbHover = element.getAttribute('thumbHoverImage')!;
  }
  if (element.hasAttribute('thumbDownImage')) {
    skinElement.images!.thumbDown = element.getAttribute('thumbDownImage')!;
  }

  // Parse colors
  if (element.hasAttribute('backgroundColor')) {
    skinElement.colors!.backgroundColor =
      element.getAttribute('backgroundColor')!;
  }
  if (element.hasAttribute('foregroundColor')) {
    skinElement.colors!.foregroundColor =
      element.getAttribute('foregroundColor')!;
  }
  if (element.hasAttribute('transparencyColor')) {
    skinElement.colors!.transparencyColor =
      element.getAttribute('transparencyColor')!;
  }
  if (element.hasAttribute('clippingColor')) {
    skinElement.colors!.clippingColor = element.getAttribute('clippingColor')!;
  }

  // Parse button-specific attributes
  if (element.hasAttribute('mappingColor')) {
    skinElement.mappingColor = element.getAttribute('mappingColor')!;
  }

  // Parse slider-specific attributes
  if (type === 'slider') {
    if (element.hasAttribute('min')) {
      skinElement.min = parseFloat(element.getAttribute('min')!);
    }
    if (element.hasAttribute('max')) {
      skinElement.max = parseFloat(element.getAttribute('max')!);
    }
    if (element.hasAttribute('value')) {
      const value = element.getAttribute('value')!;
      skinElement.value = isNaN(parseFloat(value)) ? value : parseFloat(value);
    }
    if (element.hasAttribute('direction')) {
      skinElement.direction = element.getAttribute('direction') as
        | 'horizontal'
        | 'vertical';
    }
    if (element.hasAttribute('slide')) {
      skinElement.slide = element.getAttribute('slide') === 'true';
    }
    if (element.hasAttribute('borderSize')) {
      skinElement.borderSize = parseInt(
        element.getAttribute('borderSize')!,
        10
      );
    }
    if (element.hasAttribute('tiled')) {
      skinElement.tiled = element.getAttribute('tiled') === 'true';
    }
    if (element.hasAttribute('useForegroundProgress')) {
      skinElement.useForegroundProgress =
        element.getAttribute('useForegroundProgress') === 'true';
    }
    if (element.hasAttribute('foregroundProgress')) {
      skinElement.foregroundProgress =
        element.getAttribute('foregroundProgress')!;
    }
  }

  // Parse text-specific attributes
  if (type === 'text') {
    if (element.hasAttribute('value')) {
      skinElement.textValue = element.getAttribute('value')!;
    }
    if (element.hasAttribute('fontSize')) {
      skinElement.fontSize = parseInt(element.getAttribute('fontSize')!, 10);
    }
    if (element.hasAttribute('fontStyle')) {
      skinElement.fontStyle = element.getAttribute('fontStyle')!;
    }
    if (element.hasAttribute('fontType')) {
      skinElement.fontType = element.getAttribute('fontType')!;
    }
    if (element.hasAttribute('justification')) {
      skinElement.justification = element.getAttribute('justification') as
        | 'Left'
        | 'Center'
        | 'Right';
    }
    if (element.hasAttribute('cursor')) {
      skinElement.cursor = element.getAttribute('cursor')!;
    }
  }

  // Parse playlist-specific attributes
  if (type === 'playlist') {
    if (element.hasAttribute('columnsVisible')) {
      skinElement.columnsVisible =
        element.getAttribute('columnsVisible') === 'true';
    }
    if (element.hasAttribute('columns')) {
      skinElement.columns = element.getAttribute('columns')!;
    }
    if (element.hasAttribute('dropDownVisible')) {
      skinElement.dropDownVisible =
        element.getAttribute('dropDownVisible') === 'true';
    }
    if (element.hasAttribute('playlistItemsVisible')) {
      skinElement.playlistItemsVisible =
        element.getAttribute('playlistItemsVisible') === 'true';
    }
  }

  // Parse event handlers
  if (element.hasAttribute('onClick')) {
    skinElement.onClick = element.getAttribute('onClick')!;
  }
  if (element.hasAttribute('onDragEnd')) {
    skinElement.onDragEnd = element.getAttribute('onDragEnd')!;
  }
  if (element.hasAttribute('onEndMove')) {
    skinElement.onEndMove = element.getAttribute('onEndMove')!;
  }
  if (element.hasAttribute('onLoad')) {
    skinElement.onLoad = element.getAttribute('onLoad')!;
  }
  if (element.hasAttribute('onClose')) {
    skinElement.onClose = element.getAttribute('onClose')!;
  }
  if (element.hasAttribute('OnVideoStart')) {
    skinElement.onVideoStart = element.getAttribute('OnVideoStart')!;
  }
  if (element.hasAttribute('OnVideoEnd')) {
    skinElement.onVideoEnd = element.getAttribute('OnVideoEnd')!;
  }
  if (element.hasAttribute('value_onchange')) {
    skinElement.value_onchange = element.getAttribute('value_onchange')!;
  }

  // Parse visibility and enabled state
  if (element.hasAttribute('visible')) {
    const visibleAttr = element.getAttribute('visible')!;
    skinElement.visible =
      visibleAttr === 'true' || visibleAttr === 'false'
        ? visibleAttr === 'true'
        : visibleAttr;
  }
  if (element.hasAttribute('enabled')) {
    skinElement.enabled = element.getAttribute('enabled') === 'true';
  }

  // Parse tooltip
  if (element.hasAttribute('toolTip')) {
    skinElement.toolTip = element.getAttribute('toolTip')!;
  }
  if (element.hasAttribute('upToolTip')) {
    skinElement.toolTip = element.getAttribute('upToolTip')!;
  }

  // Parse tabStop (WMP-specific)
  if (element.hasAttribute('tabStop')) {
    skinElement.visible = element.getAttribute('tabStop')!;
  }

  // Parse child elements recursively
  skinElement.children = [];
  const childElements = Array.from(element.children);
  for (const child of childElements) {
    const childElement = parseElement(child);
    if (childElement) {
      skinElement.children.push(childElement);
    }
  }

  return skinElement;
}

/**
 * Parse position value - can be a number or a jscript: expression
 * @param value - The position value from XML
 * @returns Parsed position as number or string (for jscript expressions)
 */
function parsePosition(value: string): number | string {
  if (value.startsWith('jscript:')) {
    return value; // Keep jscript expressions as strings for later evaluation
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Load and parse a skin file from a URL
 * @param skinUrl - URL to the .wms file
 * @returns Parsed skin definition
 */
export async function loadSkin(skinUrl: string): Promise<SkinDefinition> {
  const response = await fetch(skinUrl);
  if (!response.ok) {
    throw new Error(`Failed to load skin: ${response.statusText}`);
  }
  const xmlContent = await response.text();
  return parseSkinXML(xmlContent);
}

/**
 * Helper to find an element by ID in the skin definition
 * @param skinDef - The skin definition
 * @param id - The element ID to search for
 * @returns The found element or null
 */
export function findElementById(
  skinDef: SkinDefinition,
  id: string
): SkinElement | null {
  function search(elements: SkinElement[]): SkinElement | null {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (element.children && element.children.length > 0) {
        const found = search(element.children);
        if (found) return found;
      }
    }
    return null;
  }

  return search(skinDef.view.elements);
}

/**
 * Get all elements of a specific type from the skin definition
 * @param skinDef - The skin definition
 * @param type - The element type to search for
 * @returns Array of matching elements
 */
export function getElementsByType(
  skinDef: SkinDefinition,
  type: SkinElementType
): SkinElement[] {
  const results: SkinElement[] = [];

  function search(elements: SkinElement[]): void {
    for (const element of elements) {
      if (element.type === type) {
        results.push(element);
      }
      if (element.children && element.children.length > 0) {
        search(element.children);
      }
    }
  }

  search(skinDef.view.elements);
  return results;
}
