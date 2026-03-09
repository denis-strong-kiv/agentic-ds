/**
 * extract-components.ts
 * Scans packages/ui/src/components/{ui,travel}/ and extracts component metadata:
 * props, CVA variants, slots, JSDoc annotations, CSS classes, Radix primitives,
 * and rich metadata from co-located [name].metadata.ts files.
 */

import { readdirSync, existsSync, readFileSync } from 'fs';
import { resolve, join, basename } from 'path';
import {
  addSourceFile,
  extractProps,
  extractCvaVariants,
  extractJSDocAnnotations,
  extractCssClasses,
  extractRadixPrimitive,
} from './lib/ast.js';
import { readComponentMetadata } from './lib/metadata-reader.js';
import type { ComponentEntry, ComponentDomain, SlotDef } from './types.js';

const UI_ROOT = resolve(
  new URL('.', import.meta.url).pathname,
  '../../ui/src/components',
);

// ─── Slot detection ───────────────────────────────────────────────────────────

const SLOT_PROP_NAMES = new Set([
  'children', 'icon', 'prefix', 'suffix', 'leading', 'trailing',
  'leftIcon', 'rightIcon', 'startIcon', 'endIcon', 'header', 'footer',
  'label', 'description', 'action', 'badge', 'avatar',
]);

function inferSlots(props: ReturnType<typeof extractProps>): SlotDef[] {
  return props
    .filter(p => p.type === 'React.ReactNode' || SLOT_PROP_NAMES.has(p.name))
    .map(p => ({ name: p.name, description: p.description }));
}

// ─── Import specifier ─────────────────────────────────────────────────────────

function importSpecifier(domain: ComponentDomain, name: string): string {
  return `@travel/ui/components/${domain}/${name}`;
}

// ─── Single component scanner ─────────────────────────────────────────────────

async function scanComponent(
  domain: ComponentDomain,
  componentDir: string,
): Promise<ComponentEntry | null> {
  const dirName = basename(componentDir);
  const tsxPath = join(componentDir, `${dirName}.tsx`);
  if (!existsSync(tsxPath)) return null;

  const sf = addSourceFile(tsxPath);

  const pascalName = dirName
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

  // Collect exports from barrel index
  const indexPath = join(componentDir, 'index.ts');
  let exports: string[] = [];
  if (existsSync(indexPath)) {
    const indexContent = readFileSync(indexPath, 'utf-8');
    const exportMatches = [...indexContent.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)];
    exports = exportMatches
      .flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+as\s+/).pop()!.trim()))
      .filter(Boolean);
  }

  const props = extractProps(sf, pascalName);
  const variants = extractCvaVariants(sf);
  const jsDoc = extractJSDocAnnotations(sf);
  const cssClasses = extractCssClasses(sf);
  const radixPrimitive = extractRadixPrimitive(sf);
  const slots = inferSlots(props);
  const richMeta = await readComponentMetadata(componentDir, dirName);

  const hasCssContract = existsSync(join(componentDir, `${dirName}.css`));
  const acceptsClassName = props.some(p => p.name === 'className');

  const entry: ComponentEntry = {
    id: `${domain}/${dirName}`,
    name: pascalName,
    domain,
    path: `${domain}/${dirName}`,
    importFrom: importSpecifier(domain, dirName),
    exports: exports.length > 0 ? exports : [pascalName],
    props,
    variants,
    slots,
    cssClasses,
    hasCssContract,
    acceptsClassName,
  };

  if (radixPrimitive) entry.radixPrimitive = radixPrimitive;
  if (jsDoc.description) entry.description = jsDoc.description;
  if (jsDoc.patterns.length > 0) entry.patterns = jsDoc.patterns;
  if (jsDoc.uses.length > 0) entry.uses = jsDoc.uses;
  if (richMeta.aiHints) entry.aiHints = richMeta.aiHints;
  if (richMeta.behavior) entry.behavior = richMeta.behavior;
  if (richMeta.accessibility) entry.accessibility = richMeta.accessibility;
  if (richMeta.examples) entry.examples = richMeta.examples;

  return entry;
}

// ─── Domain scanner ───────────────────────────────────────────────────────────

async function scanDomain(domain: ComponentDomain): Promise<ComponentEntry[]> {
  const domainDir = join(UI_ROOT, domain);
  if (!existsSync(domainDir)) return [];

  const entries: ComponentEntry[] = [];

  for (const name of readdirSync(domainDir)) {
    if (name === 'index.ts' || name === '__tests__') continue;
    const componentDir = join(domainDir, name);
    try {
      const entry = await scanComponent(domain, componentDir);
      if (entry) entries.push(entry);
    } catch {
      // Silently skip components that fail to parse
    }
  }

  return entries;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function extractComponents(): Promise<ComponentEntry[]> {
  const [ui, travel] = await Promise.all([
    scanDomain('ui'),
    scanDomain('travel'),
  ]);
  return [...ui, ...travel];
}
