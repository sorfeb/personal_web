/**
 * Region mapper for WMP skins
 * Handles parsing mapping images and detecting clickable regions by color
 */

import type { ClickableRegion, SkinElement } from '@/types/wmp';
import { getPixelColor } from './assetLoader';

/**
 * Parse a buttongroup element and create clickable regions from its mapping image
 * @param buttongroupElement - The buttongroup skin element
 * @param mappingImageData - Pixel data from the mapping image
 * @param onClickHandlers - Map of button IDs to click handlers
 * @returns Array of clickable regions
 */
export function parseButtonGroup(
  buttongroupElement: SkinElement,
  mappingImageData: ImageData,
  onClickHandlers: Map<string, () => void>
): ClickableRegion[] {
  const regions: ClickableRegion[] = [];

  if (!buttongroupElement.children) {
    return regions;
  }

  // Process each button element in the group
  for (const buttonElement of buttongroupElement.children) {
    if (!buttonElement.mappingColor) {
      continue;
    }

    /*
     * Region id resolution: explicit `id` attr wins (e.g. <buttonelement id="vis">),
     * otherwise fall back to the element's WMS tag type (e.g. <playelement> →
     * 'playelement') so typed transport buttons can be looked up by their type
     * rather than a positional `button_N` index. The positional fallback only
     * applies to anonymous, untyped button children.
     */
    const region: ClickableRegion = {
      id: buttonElement.id || buttonElement.type || `button_${regions.length}`,
      elementId: buttonElement.id,
      color: normalizeColor(buttonElement.mappingColor),
      toolTip: buttonElement.toolTip,
    };

    // Get click handler if available
    const handler = onClickHandlers.get(region.id);
    if (handler) {
      region.onClick = handler;
    }

    // Calculate bounds by scanning the mapping image
    const bounds = calculateColorBounds(
      mappingImageData,
      region.color
    );
    if (bounds) {
      region.bounds = bounds;
    }

    regions.push(region);
  }

  return regions;
}

/**
 * Calculate the bounding box of a specific color in an image
 * @param imageData - The image data to scan
 * @param targetColor - The color to find (hex string)
 * @returns Bounding box or null if color not found
 */
function calculateColorBounds(
  imageData: ImageData,
  targetColor: string
): { x: number; y: number; width: number; height: number } | null {
  let minX = imageData.width;
  let minY = imageData.height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  // Scan all pixels
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const pixelColor = getPixelColor(imageData, x, y);
      if (pixelColor && normalizeColor(pixelColor) === targetColor) {
        found = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!found) {
    return null;
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Detect which region is at a specific point
 * @param regions - Array of clickable regions
 * @param x - X coordinate (relative to buttongroup)
 * @param y - Y coordinate (relative to buttongroup)
 * @param mappingImageData - Pixel data from the mapping image
 * @returns The region at that point, or null
 */
export function getRegionAtPoint(
  regions: ClickableRegion[],
  x: number,
  y: number,
  mappingImageData: ImageData
): ClickableRegion | null {
  // Get the color at this pixel
  const pixelColor = getPixelColor(mappingImageData, Math.floor(x), Math.floor(y));
  if (!pixelColor) {
    return null;
  }

  const normalizedColor = normalizeColor(pixelColor);

  // Find matching region
  return regions.find((region) => region.color === normalizedColor) || null;
}

/**
 * Check if a point is inside a region's bounds
 * @param region - The region to check
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns True if point is inside region
 */
export function isPointInRegion(
  region: ClickableRegion,
  x: number,
  y: number
): boolean {
  if (!region.bounds) {
    return false;
  }

  return (
    x >= region.bounds.x &&
    x <= region.bounds.x + region.bounds.width &&
    y >= region.bounds.y &&
    y <= region.bounds.y + region.bounds.height
  );
}

/**
 * Normalize a color string to uppercase hex format
 * @param color - Color string (can be "#FF0000" or "FF0000")
 * @returns Normalized color (e.g., "#FF0000")
 */
function normalizeColor(color: string): string {
  let normalized = color.toUpperCase();
  if (!normalized.startsWith('#')) {
    normalized = `#${normalized}`;
  }
  return normalized;
}

/**
 * Create a debug visualization of regions
 * Draws colored rectangles on a canvas for debugging
 * @param canvas - Canvas element to draw on
 * @param regions - Regions to visualize
 * @param mappingImageData - Optional mapping image to show underneath
 */
export function debugDrawRegions(
  canvas: HTMLCanvasElement,
  regions: ClickableRegion[],
  mappingImageData?: ImageData
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw mapping image if provided
  if (mappingImageData) {
    canvas.width = mappingImageData.width;
    canvas.height = mappingImageData.height;
    ctx.putImageData(mappingImageData, 0, 0);
  }

  // Draw region bounds
  ctx.lineWidth = 2;
  regions.forEach((region, index) => {
    if (!region.bounds) return;

    // Use different colors for each region
    const hue = (index * 137.5) % 360;
    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.2)`;

    ctx.fillRect(
      region.bounds.x,
      region.bounds.y,
      region.bounds.width,
      region.bounds.height
    );
    ctx.strokeRect(
      region.bounds.x,
      region.bounds.y,
      region.bounds.width,
      region.bounds.height
    );

    // Draw label
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = '12px monospace';
    const label = region.id || 'unknown';
    ctx.strokeText(label, region.bounds.x + 5, region.bounds.y + 15);
    ctx.fillText(label, region.bounds.x + 5, region.bounds.y + 15);
  });
}

/**
 * Parse all buttongroups in a skin and create region maps
 * @param elements - Skin elements to parse
 * @param mappingImages - Map of mapping image filenames to ImageData
 * @param onClickHandlers - Map of button IDs to click handlers
 * @returns Map of buttongroup IDs to their regions
 */
export function parseAllButtonGroups(
  elements: SkinElement[],
  mappingImages: Map<string, ImageData>,
  onClickHandlers: Map<string, () => void>
): Map<string, ClickableRegion[]> {
  const regionMaps = new Map<string, ClickableRegion[]>();

  function processElements(elementList: SkinElement[]): void {
    for (const element of elementList) {
      if (element.type === 'buttongroup' && element.images?.mapping) {
        const mappingImage = mappingImages.get(element.images.mapping);
        if (mappingImage) {
          const regions = parseButtonGroup(
            element,
            mappingImage,
            onClickHandlers
          );
          const id = element.id || `buttongroup_${regionMaps.size}`;
          regionMaps.set(id, regions);
        }
      }

      // Recurse into children
      if (element.children && element.children.length > 0) {
        processElements(element.children);
      }
    }
  }

  processElements(elements);
  return regionMaps;
}
