/**
 * Asset loader for WMP skins
 * Handles loading and processing of BMP images, transparency, and caching
 */

import type { SkinAssets, SkinDefinition } from '@/types/wmp';

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
  const images = new Map<string, string>();
  const mappings = new Map<string, ImageData>();

  // Collect all unique image filenames from the skin definition
  const imageFiles = new Set<string>();
  const mappingFiles = new Set<string>();

  collectImageFiles(skinDef.view.elements, imageFiles, mappingFiles);

  // Load all regular images
  const imagePromises = Array.from(imageFiles).map(async (filename) => {
    try {
      const url = await loadImage(skinPath, filename);
      images.set(filename, url);
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
 * Recursively collect all image filenames from skin elements
 */
function collectImageFiles(
  elements: Array<any>,
  imageFiles: Set<string>,
  mappingFiles: Set<string>
): void {
  for (const element of elements) {
    // Regular images
    if (element.images) {
      if (element.images.default) imageFiles.add(element.images.default);
      if (element.images.hover) imageFiles.add(element.images.hover);
      if (element.images.down) imageFiles.add(element.images.down);
      if (element.images.disabled) imageFiles.add(element.images.disabled);
      if (element.images.background) imageFiles.add(element.images.background);
      if (element.images.foreground) imageFiles.add(element.images.foreground);
      if (element.images.thumb) imageFiles.add(element.images.thumb);
      if (element.images.thumbHover) imageFiles.add(element.images.thumbHover);
      if (element.images.thumbDown) imageFiles.add(element.images.thumbDown);

      // Mapping images go to separate set
      if (element.images.mapping) mappingFiles.add(element.images.mapping);
    }

    // Recurse into children
    if (element.children && element.children.length > 0) {
      collectImageFiles(element.children, imageFiles, mappingFiles);
    }
  }
}

/**
 * Load a single image and return as data URL or object URL
 * @param skinPath - Base path to skin folder
 * @param filename - Image filename
 * @returns URL to the loaded image
 */
export async function loadImage(
  skinPath: string,
  filename: string
): Promise<string> {
  const fullPath = `${skinPath}/${filename}`;

  // For now, just return the path - browsers can handle BMP natively
  // In production, we might want to convert to PNG/WebP for better performance
  return fullPath;
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
