/**
 * CSS custom property parser — extracts design tokens from tokens.css.
 * Handles OKLCH values, calc() expressions, and grouped properties.
 */

import { readFileSync } from 'fs';
import type { DesignToken, TokenManifest } from '../types.js';

// ─── Category inference ───────────────────────────────────────────────────────

const CATEGORY_PATTERNS: Array<{ prefix: RegExp; category: string }> = [
  { prefix: /^--color-/, category: 'color' },
  { prefix: /^--spacing-/, category: 'spacing' },
  { prefix: /^--font-size-/, category: 'typography' },
  { prefix: /^--font-weight-/, category: 'typography' },
  { prefix: /^--font-family-/, category: 'typography' },
  { prefix: /^--font-/, category: 'typography' },
  { prefix: /^--line-height-/, category: 'typography' },
  { prefix: /^--letter-spacing-/, category: 'typography' },
  { prefix: /^--duration-/, category: 'motion' },
  { prefix: /^--easing-/, category: 'motion' },
  { prefix: /^--shadow-/, category: 'shadow' },
  { prefix: /^--shape-/, category: 'shape' },
  { prefix: /^--breakpoint-/, category: 'breakpoint' },
  { prefix: /^--radius-/, category: 'shape' },
  { prefix: /^--z-/, category: 'elevation' },
];

function inferCategory(name: string): string {
  for (const { prefix, category } of CATEGORY_PATTERNS) {
    if (prefix.test(name)) return category;
  }
  return 'other';
}

function inferGroup(name: string, category: string): string | undefined {
  if (category === 'color') {
    // --color-primary-default → primary
    // --color-foreground-muted → foreground
    const match = /^--color-([a-z]+)/.exec(name);
    return match?.[1];
  }
  if (category === 'shape') {
    const match = /^--shape-(?:preset-)?([a-z]+)/.exec(name);
    return match?.[1];
  }
  if (category === 'shadow') {
    const match = /^--shadow-([a-z]+)/.exec(name);
    return match?.[1];
  }
  return undefined;
}

// ─── CSS parser ───────────────────────────────────────────────────────────────

/**
 * Minimal CSS custom property extractor.
 * Reads the flat :root / .dark / .brand-* blocks and collects all --name: value pairs.
 */
export function parseTokensFile(cssPath: string): DesignToken[] {
  const css = readFileSync(cssPath, 'utf-8');
  const tokens: DesignToken[] = [];
  const seen = new Set<string>();

  // Match --property-name: value; (value may span no newlines, ends at semicolon)
  // Use a broad regex and filter by meaningful names
  const propRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;

  while ((match = propRegex.exec(css)) !== null) {
    const name = match[1].trim();
    const value = match[2].trim();

    // Skip non-design-token CSS vars (e.g. internal calc variables)
    if (!CATEGORY_PATTERNS.some(p => p.prefix.test(name))) continue;
    // Skip duplicates (light mode takes precedence over dark)
    if (seen.has(name)) continue;

    seen.add(name);
    const category = inferCategory(name);
    const group = inferGroup(name, category);

    const token: DesignToken = { name, value, category };
    if (group) token.group = group;
    tokens.push(token);
  }

  return tokens;
}

// ─── Manifest builder ─────────────────────────────────────────────────────────

export function buildTokenManifest(cssPath: string): TokenManifest {
  const all = parseTokensFile(cssPath);

  const byCategory: Record<string, DesignToken[]> = {};
  for (const token of all) {
    if (!byCategory[token.category]) byCategory[token.category] = [];
    byCategory[token.category].push(token);
  }

  return {
    total: all.length,
    byCategory,
    all,
  };
}

// ─── Token lookup helpers (used by DSL generator) ─────────────────────────────

export function getTokensByCategory(manifest: TokenManifest, category: string): DesignToken[] {
  return manifest.byCategory[category] ?? [];
}

export function findToken(manifest: TokenManifest, name: string): DesignToken | undefined {
  return manifest.all.find(t => t.name === name);
}
