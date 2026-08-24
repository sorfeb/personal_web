/**
 * Byte-level loading for .wms manifests.
 *
 * Skins of this era were authored in whatever the tool of the day emitted, and
 * the ones in `public/assets/skins` disagree:
 *
 *   headspace.wms  windows-1252, no BOM   (© in the copyright comment)
 *   cerulean.wms   windows-1252, no BOM
 *   MediaBay.wms   windows-1252, no BOM
 *   Corona.wms     UTF-16LE with BOM
 *   wood.wms       UTF-16LE with BOM
 *
 * `Response.text()` assumes UTF-8 and turns both of the last two into mojibake
 * that fails to parse, so we take the bytes and pick a decoder ourselves.
 */

/**
 * Decode manifest bytes to text.
 *
 * A BOM is authoritative when present. Without one, WMS predates UTF-8's
 * spread, so windows-1252 is the correct default rather than a fallback: it
 * maps every byte, which means decoding never throws and a mis-guess costs at
 * most a wrong glyph inside a comment.
 */
export function decodeSkinText(bytes: ArrayBuffer): string {
  const head = new Uint8Array(bytes.slice(0, 3));

  if (head[0] === 0xff && head[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(bytes.slice(2));
  }
  if (head[0] === 0xfe && head[1] === 0xff) {
    return new TextDecoder('utf-16be').decode(bytes.slice(2));
  }
  if (head[0] === 0xef && head[1] === 0xbb && head[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes.slice(3));
  }

  return new TextDecoder('windows-1252').decode(bytes);
}

/** Fetch a manifest and decode it. Throws with the URL on a non-2xx response. */
export async function fetchSkinText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load skin manifest ${url}: ${response.status} ${response.statusText}`);
  }
  return decodeSkinText(await response.arrayBuffer());
}
