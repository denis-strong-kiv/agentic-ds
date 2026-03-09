/**
 * extract-dependency-graph.ts
 * Builds a component dependency graph by analyzing import statements in each
 * component's TSX file. Only captures intra-kit dependencies (ui/* → travel/*).
 */

import { existsSync } from 'fs';
import { resolve, join, basename } from 'path';
import { addSourceFile, extractImports } from './lib/ast.js';
import type { ComponentEntry, DependencyGraph, DependencyEdge } from './types.js';

const UI_ROOT = resolve(
  new URL('.', import.meta.url).pathname,
  '../../ui/src/components',
);

// Map of known external libraries to 'external' kind
const EXTERNAL_LIBS = new Set([
  'react', 'react-dom', 'class-variance-authority', 'clsx', 'tailwind-merge',
  'lucide-react', 'maplibre-gl', 'react-map-gl',
]);

function isRadixImport(specifier: string): boolean {
  return specifier.startsWith('@radix-ui/');
}

function resolveComponentId(
  fromId: string,
  specifier: string,
): string | null {
  // Relative import like ../button or ../../ui/button
  if (!specifier.startsWith('.')) return null;

  const [fromDomain, fromName] = fromId.split('/');
  const fromDir = join(UI_ROOT, fromDomain, fromName);

  // Resolve the specifier relative to the component's directory
  const resolved = resolve(fromDir, specifier);

  // Match against known component paths
  for (const domain of ['ui', 'travel']) {
    const domainDir = join(UI_ROOT, domain);
    if (resolved.startsWith(domainDir)) {
      const rel = resolved.slice(domainDir.length + 1).split('/')[0];
      if (rel && rel !== 'index') return `${domain}/${rel}`;
    }
  }

  return null;
}

export function buildDependencyGraph(components: ComponentEntry[]): DependencyGraph {
  const nodes = components.map(c => c.id);
  const edges: DependencyEdge[] = [];
  const adjacency: Record<string, string[]> = {};

  const componentIds = new Set(nodes);

  for (const component of components) {
    const tsxPath = join(UI_ROOT, component.domain, basename(component.path), `${basename(component.path)}.tsx`);
    if (!existsSync(tsxPath)) continue;

    const sf = addSourceFile(tsxPath);
    const imports = extractImports(sf);
    adjacency[component.id] = [];

    for (const imp of imports) {
      if (imp.isExternal) {
        if (isRadixImport(imp.specifier)) {
          edges.push({ from: component.id, to: imp.specifier, kind: 'external' });
        } else if (EXTERNAL_LIBS.has(imp.specifier)) {
          edges.push({ from: component.id, to: imp.specifier, kind: 'external' });
        }
        continue;
      }

      const targetId = resolveComponentId(component.id, imp.specifier);
      if (!targetId) continue;

      if (componentIds.has(targetId)) {
        edges.push({ from: component.id, to: targetId, kind: 'component' });
        adjacency[component.id].push(targetId);
      } else if (imp.specifier.includes('utils') || imp.specifier.includes('lib')) {
        edges.push({ from: component.id, to: imp.specifier, kind: 'util' });
      }
    }
  }

  return { nodes, edges, adjacency };
}
