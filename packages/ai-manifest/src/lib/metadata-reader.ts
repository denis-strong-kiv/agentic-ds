/**
 * metadata-reader.ts
 * Reads co-located [name].metadata.ts files and merges them into ComponentEntry.
 * Falls back gracefully when no metadata file exists.
 */

import { existsSync } from 'fs';
import { join } from 'path';
import type { ComponentMetadataShape } from '../../../../ui/src/component-metadata.js';

export interface ComponentRichMetadata {
  aiHints?: ComponentMetadataShape['aiHints'];
  behavior?: ComponentMetadataShape['behavior'];
  accessibility?: ComponentMetadataShape['accessibility'];
  examples?: ComponentMetadataShape['examples'];
}

/**
 * Dynamically imports a .metadata.ts file for a component and returns its data.
 * Returns an empty object if the file doesn't exist or fails to load.
 */
export async function readComponentMetadata(
  componentDir: string,
  dirName: string,
): Promise<ComponentRichMetadata> {
  const metaPath = join(componentDir, `${dirName}.metadata.ts`);
  if (!existsSync(metaPath)) return {};

  try {
    const mod = await import(metaPath) as { metadata?: ComponentMetadataShape };
    const meta = mod.metadata;
    if (!meta) return {};

    const result: ComponentRichMetadata = {};
    if (meta.aiHints) result.aiHints = meta.aiHints;
    if (meta.behavior) result.behavior = meta.behavior;
    if (meta.accessibility) result.accessibility = meta.accessibility;
    if (meta.examples && meta.examples.length > 0) result.examples = meta.examples;
    return result;
  } catch {
    return {};
  }
}
