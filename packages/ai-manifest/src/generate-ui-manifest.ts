/**
 * generate-ui-manifest.ts — main orchestrator
 *
 * Run:  pnpm --filter @travel/ai-manifest generate
 *   or: pnpm generate:ui-manifest
 *
 * Output: docs/ui-manifest.dsl  (committed to repo)
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { extractTokens } from './extract-tokens.js';
import { extractComponents } from './extract-components.js';
import { buildDependencyGraph } from './extract-dependency-graph.js';
import { detectPatterns } from './detect-patterns.js';
import { serializeToDSL } from './lib/dsl.js';
import type { UIManifest } from './types.js';

// ─── Output path ──────────────────────────────────────────────────────────────

const DSL_OUT = resolve(new URL('.', import.meta.url).pathname, '../../../docs/ui-manifest.dsl');

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const tokens = extractTokens();
  const components = extractComponents();
  const dependencyGraph = buildDependencyGraph(components);
  const { patterns, screenMappings } = detectPatterns(components);

  const manifest: UIManifest = {
    meta: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      componentCount: components.length,
      tokenCount: tokens.total,
      patternCount: patterns.length,
    },
    tokens,
    components,
    dependencyGraph,
    patterns,
    screenMappings,
    dsl: '',
  };

  manifest.dsl = serializeToDSL(manifest);
  writeFileSync(DSL_OUT, manifest.dsl, 'utf-8');

  const kb = (Buffer.byteLength(manifest.dsl, 'utf-8') / 1024).toFixed(1);
  console.log(`✅ docs/ui-manifest.dsl (${kb} KB) — ${components.length} components · ${tokens.total} tokens · ${patterns.length} patterns`);
}

main().catch(err => {
  console.error('❌ Manifest generation failed:', err);
  process.exit(1);
});
