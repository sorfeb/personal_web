/**
 * The catalogue of installed skins.
 *
 * A `.wmz` is a zip whose manifest name has no relation to the archive name:
 * `9SeriesDefault.wmz` contains `Corona.wms`, `Halloween.wmz` contains
 * `wood.wms`. Unpacked into `public/assets/skins/<id>/`, the manifest keeps
 * its original name, so the registry records it rather than guessing.
 *
 * Adding a skin is: unpack the .wmz into `public/assets/skins/<id>/`, add a
 * row here. No parser change.
 */

export interface SkinManifest {
  /** Stable id. Doubles as the folder name and the persisted preference. */
  id: string;
  /** Shown in the skin picker. */
  label: string;
  /** The `.wms` file inside the folder. Not derivable from `id`. */
  manifest: string;
  /** Author credit, shown in the picker so attribution travels with the art. */
  credit: string;
  /**
   * Nominal view size from the manifest, used to size the window shell before
   * the skin has finished parsing. The parsed view is authoritative afterwards.
   */
  width: number;
  height: number;
}

export const SKINS: SkinManifest[] = [
  {
    id: 'headspace',
    label: 'Headspace',
    manifest: 'headspace.wms',
    credit: 'Microsoft Corporation',
    width: 760,
    height: 394,
  },
  {
    id: 'cerulean',
    label: 'Cerulean',
    manifest: 'cerulean.wms',
    credit: 'Microsoft Corporation',
    width: 237,
    height: 412,
  },
];

export const DEFAULT_SKIN_ID = 'headspace';

/** Public URL of a skin's asset folder. */
export function skinPathFor(skin: SkinManifest): string {
  return `/assets/skins/${skin.id}`;
}

/** Public URL of a skin's manifest. */
export function manifestUrlFor(skin: SkinManifest): string {
  return `${skinPathFor(skin)}/${skin.manifest}`;
}

/** Look up a skin by id, falling back to the default for unknown ids. */
export function getSkin(id: string | null | undefined): SkinManifest {
  return (
    SKINS.find((skin) => skin.id === id) ??
    SKINS.find((skin) => skin.id === DEFAULT_SKIN_ID) ??
    SKINS[0]
  );
}
