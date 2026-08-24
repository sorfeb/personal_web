/**
 * Asset loader for WMP skins
 * Handles loading images, applying colour-key transparency, and caching
 */

import type { SkinAssets, SkinDefinition, SkinElement, ImageInfo } from '@/types/wmp';

/**
 * The colour WMP skins use for "punch this out" when they say nothing else.
 * Universal enough across the era that a BMP with no declared key is safe to
 * treat this way, and BMP carries no alpha channel to consult instead.
 */
const DEFAULT_COLOR_KEY = '#FF00FF';

/** Formats that carry their own alpha, so blanket colour-keying would be wrong. */
const ALPHA_CAPABLE = /\.(png|gif)$/i;

/**
 * Load all assets for a skin
 * @param skinPath - Base path to the skin folder (e.g., "/assets/skins/headspace")
 * @param skinDef - Parsed skin definition
 * @returns Loaded assets with images and mappings
 */
export async function loadSkinAssets(
  skinPath: string,
  skinDef: SkinDefinition
): Promise<SkinAssets> {
  const images = new Map<string, ImageInfo>();
  const mappings = new Map<string, ImageData>();

  // Collect all unique image filenames from every view in the skin
  const imageKeys = new Map<string, Set<string>>();
  const mappingFiles = new Set<string>();

  for (const view of skinDef.views) {
    collectImageFiles(view.elements, imageKeys, mappingFiles, []);
  }

  // Load all regular images
  const imagePromises = Array.from(imageKeys).map(async ([filename, declared]) => {
    try {
      const imageInfo = await loadImage(skinPath, filename, colorKeysFor(filename, declared));
      images.set(filename, imageInfo);
    } catch (error) {
      console.warn(`Failed to load image ${filename}:`, error);
    }
  });

  // Load all mapping images
  const mappingPromises = Array.from(mappingFiles).map(async (filename) => {
    try {
      const imageData = await loadMappingImage(skinPath, filename);
      mappings.set(filename, imageData);
    } catch (error) {
      console.warn(`Failed to load mapping image ${filename}:`, error);
    }
  });

  await Promise.all([...imagePromises, ...mappingPromises]);

  return { images, mappings };
}

/**
 * Decide which colours to punch out of an image.
 *
 * Declared `transparencyColor` / `clippingColor` values win. With none
 * declared, an alpha-capable format is left alone and a BMP falls back to the
 * magenta convention.
 *
 * The previous implementation keyed magenta *and* pure red out of every image
 * unconditionally. That matched headspace, whose `clippingColor="#FF0000"`
 * subview wants exactly that, but it would punch holes in any skin whose art
 * legitimately contains red (Halloween's PNGs, for one).
 */
function colorKeysFor(filename: string, declared: Set<string>): string[] {
  if (declared.size > 0) return Array.from(declared);
  return ALPHA_CAPABLE.test(filename) ? [] : [DEFAULT_COLOR_KEY];
}

/**
 * Recursively collect image filenames and the colour keys that apply to them.
 *
 * Keys are inherited down the tree: a `<subview>` declaring a clippingColor
 * expects it to apply to the art its children draw, not only to its own
 * background.
 */
function collectImageFiles(
  elements: SkinElement[],
  imageKeys: Map<string, Set<string>>,
  mappingFiles: Set<string>,
  inheritedKeys: string[]
): void {
  for (const element of elements) {
    const keys = [...inheritedKeys];
    if (element.colors?.transparencyColor) keys.push(element.colors.transparencyColor);
    if (element.colors?.clippingColor) keys.push(element.colors.clippingColor);

    const images = element.images;
    if (images) {
      const drawn = [
        images.default,
        images.hover,
        images.down,
        images.disabled,
        images.background,
        images.foreground,
        images.thumb,
        images.thumbHover,
        images.thumbDown,
      ];

      for (const filename of drawn) {
        if (!filename) continue;
        const existing = imageKeys.get(filename) ?? new Set<string>();
        for (const key of keys) existing.add(key.toUpperCase());
        imageKeys.set(filename, existing);
      }

      // Mapping images are read as pixel data, never colour-keyed.
      if (images.mapping) mappingFiles.add(images.mapping);
    }

    if (element.children && element.children.length > 0) {
      collectImageFiles(element.children, imageKeys, mappingFiles, keys);
    }
  }
}

/**
 * Load a single image and return image info with dimensions.
 *
 * @param skinPath - Base path to skin folder
 * @param filename - Image filename
 * @param colorKeys - Hex colours to punch to alpha 0. Empty leaves the image
 *   untouched, which is what alpha-carrying formats want.
 * @returns Object with URL and dimensions
 */
export async function loadImage(
  skinPath: string,
  filename: string,
  colorKeys: string[] = [DEFAULT_COLOR_KEY]
): Promise<{ url: string; width: number; height: number }> {
  const fullPath = `${skinPath}/${filename}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for canvas processing

    img.onload = () => {
      const natural = { width: img.naturalWidth, height: img.naturalHeight };

      // Nothing to punch out: hand back the original URL and skip the canvas
      // round-trip entirely, which also keeps the image out of a data: URI.
      if (colorKeys.length === 0) {
        resolve({ url: fullPath, ...natural });
        return;
      }

      try {
        const canvas = document.createElement('canvas');
        canvas.width = natural.width;
        canvas.height = natural.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ url: fullPath, ...natural });
          return;
        }

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const targets = colorKeys
          .map(hexToRgb)
          .filter((rgb): rgb is { r: number; g: number; b: number } => rgb !== null);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Small tolerance absorbs the rounding older encoders introduced.
          const keyed = targets.some(
            (target) =>
              Math.abs(r - target.r) <= 5 &&
              Math.abs(g - target.g) <= 5 &&
              Math.abs(b - target.b) <= 5
          );

          if (keyed) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        resolve({ url: canvas.toDataURL('image/png'), ...natural });
      } catch (error) {
        console.warn(`Failed to process transparency for ${filename}:`, error);
        resolve({ url: fullPath, ...natural });
      }
    };

    img.onerror = () => {
      console.warn(`Failed to load image: ${fullPath}`);
      resolve({ url: fullPath, width: 0, height: 0 });
    };

    img.src = fullPath;
  });
}

/**
 * Load a mapping image and extract pixel data for region detection
 * @param skinPath - Base path to skin folder
 * @param filename - Mapping image filename
 * @returns ImageData with pixel information
 */
export async function loadMappingImage(
  skinPath: string,
  filename: string
): Promise<ImageData> {
  const fullPath = `${skinPath}/${filename}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS if needed

    img.onload = () => {
      // Create a canvas to extract pixel data
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);

      // Extract pixel data
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      } catch (error) {
        reject(new Error(`Failed to extract image data: ${error}`));
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load mapping image: ${fullPath}`));
    };

    img.src = fullPath;
  });
}

/**
 * Process an image with transparency color
 * Creates a new image with transparent pixels where the color matches
 * @param imageSrc - Source image URL
 * @param transparencyColor - Hex color to make transparent (e.g., "#FF00FF")
 * @returns Data URL of processed image
 */
export async function applyTransparency(
  imageSrc: string,
  transparencyColor: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parse transparency color
      const rgb = hexToRgb(transparencyColor);
      if (!rgb) {
        reject(new Error(`Invalid transparency color: ${transparencyColor}`));
        return;
      }

      // Replace matching pixels with transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel matches transparency color (with small tolerance)
        if (
          Math.abs(r - rgb.r) <= 5 &&
          Math.abs(g - rgb.g) <= 5 &&
          Math.abs(b - rgb.b) <= 5
        ) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      // Put modified data back
      ctx.putImageData(imageData, 0, 0);

      // Export as data URL
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageSrc}`));
    };

    img.src = imageSrc;
  });
}

/**
 * Convert hex color to RGB
 * @param hex - Hex color string (e.g., "#FF00FF" or "FF00FF")
 * @returns RGB object or null if invalid
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Parse hex values
  const bigint = parseInt(cleanHex, 16);

  if (isNaN(bigint)) {
    return null;
  }

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Preload an image to ensure it's cached
 * @param src - Image source URL
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
    img.src = src;
  });
}

/**
 * Batch preload multiple images
 * @param sources - Array of image URLs
 * @returns Promise that resolves when all images are loaded
 */
export async function preloadImages(sources: string[]): Promise<void> {
  await Promise.all(sources.map(preloadImage));
}

/**
 * Get the color at a specific pixel in ImageData
 * @param imageData - The ImageData to sample
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Hex color string or null if out of bounds
 */
export function getPixelColor(
  imageData: ImageData,
  x: number,
  y: number
): string | null {
  if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
    return null;
  }

  const index = (y * imageData.width + x) * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];

  // Convert to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}
