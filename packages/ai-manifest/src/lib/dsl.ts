/**
 * DSL serializer — converts the full manifest into a compact, line-oriented
 * plain-text format designed for ultra-low LLM token usage.
 *
 * Format overview:
 *   # TOKENS
 *   color primary-default oklch(0.50 0.22 250)
 *   spacing 4 1rem
 *
 *   # COMPONENTS
 *   C ui/button Button [variant:default|primary|destructive|outline|ghost|link] [size:default|sm|lg|icon]
 *     P children:ReactNode req
 *     P variant:enum=default
 *     P className:string?
 *
 *   # PATTERNS
 *   PAT search-form "Search Form" [ui/input,ui/button,travel/search-overlay]
 *
 *   # SCREENS
 *   SCR flights-search "Flights Search" [travel/filter-bar,travel/flight-card]
 */

import type { UIManifest, ComponentEntry, VariantAxis } from '../types.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function variantDSL(axes: VariantAxis[]): string {
  if (axes.length === 0) return '';
  return axes
    .map(a => `[${a.name}:${a.values.join('|')}${a.default ? `=${a.default}` : ''}]`)
    .join(' ');
}

function componentLine(c: ComponentEntry): string {
  const v = variantDSL(c.variants);
  const parts = [`C ${c.id} ${c.name}`];
  if (v) parts.push(v);
  if (c.radixPrimitive) parts.push(`@${c.radixPrimitive.replace('@radix-ui/react-', '')}`);
  return parts.join(' ');
}

function propLines(c: ComponentEntry): string[] {
  return c.props
    .filter(p => p.name !== 'className' && p.name !== 'ref') // already implied
    .slice(0, 12) // cap at 12 props to keep manifest compact
    .map(p => {
      const req = p.required ? ' req' : '?';
      const type =
        p.type === 'enum' && p.values
          ? `enum(${p.values.join('|')})`
          : p.type;
      const def = p.default ? `=${p.default}` : '';
      return `  P ${p.name}:${type}${def}${req}`;
    });
}

// ─── Main serializer ──────────────────────────────────────────────────────────

export function serializeToDSL(manifest: UIManifest): string {
  const lines: string[] = [];

  // ── Tokens ──────────────────────────────────────────────────────────────────
  lines.push('# TOKENS');
  for (const [category, tokens] of Object.entries(manifest.tokens.byCategory)) {
    for (const t of tokens) {
      // Compact: strip --  prefix and category prefix to save tokens
      const shortName = t.name
        .replace(/^--color-/, '')
        .replace(/^--spacing-/, '')
        .replace(/^--font-size-/, 'fs/')
        .replace(/^--font-weight-/, 'fw/')
        .replace(/^--shadow-/, 'shadow/')
        .replace(/^--shape-preset-?/, 'shape/')
        .replace(/^--duration-/, 'dur/')
        .replace(/^--easing-/, 'ease/');
      lines.push(`${category} ${shortName} ${t.value}`);
    }
  }
  lines.push('');

  // ── Components ───────────────────────────────────────────────────────────────
  lines.push('# COMPONENTS');
  for (const c of manifest.components) {
    lines.push(componentLine(c));
    if (c.description) lines.push(`  # ${c.description}`);
    lines.push(...propLines(c));
    if (c.slots.length > 0) {
      lines.push(`  SLOTS ${c.slots.map(s => s.name).join(' ')}`);
    }
    if (c.uses && c.uses.length > 0) {
      lines.push(`  USES ${c.uses.join(' ')}`);
    }
    if (c.aiHints) {
      lines.push(`  WHEN ${c.aiHints.whenToUse}`);
      if (c.aiHints.whenNotToUse) lines.push(`  NOT ${c.aiHints.whenNotToUse}`);
      if (c.aiHints.alternatives?.length) lines.push(`  ALT ${c.aiHints.alternatives.join(' | ')}`);
      if (c.aiHints.preferOver) lines.push(`  PREFER_OVER ${c.aiHints.preferOver}`);
    }
    if (c.behavior) {
      lines.push(`  STATES ${c.behavior.states.join(' | ')}`);
      if (c.behavior.animations?.length) lines.push(`  ANIM ${c.behavior.animations.join(' | ')}`);
      if (c.behavior.responsive) lines.push(`  RESPONSIVE ${c.behavior.responsive}`);
    }
    if (c.accessibility) {
      lines.push(`  A11Y role=${c.accessibility.role} keys="${c.accessibility.keyboardNav}"`);
      if (c.accessibility.wcag?.length) lines.push(`  WCAG ${c.accessibility.wcag.join(' ')}`);
    }
    if (c.examples?.length) {
      for (const ex of c.examples) {
        // Inline single-line example; multi-line collapsed to first line
        const code = ex.code.replace(/\n\s*/g, ' ');
        lines.push(`  EX "${ex.label}" ${code}`);
      }
    }
    lines.push('');
  }

  // ── Dependency graph (compact adjacency) ─────────────────────────────────────
  lines.push('# DEPS');
  for (const [node, deps] of Object.entries(manifest.dependencyGraph.adjacency)) {
    if (deps.length > 0) {
      lines.push(`${node} -> ${deps.join(' ')}`);
    }
  }
  lines.push('');

  // ── Patterns ─────────────────────────────────────────────────────────────────
  lines.push('# PATTERNS');
  for (const p of manifest.patterns) {
    lines.push(`PAT ${p.id} "${p.label}" [${p.components.join(',')}]`);
    if (p.description) lines.push(`  # ${p.description}`);
    if (p.example) lines.push(`  EXAMPLE ${p.example}`);
  }
  lines.push('');

  // ── Screen mappings ───────────────────────────────────────────────────────────
  lines.push('# SCREENS');
  for (const s of manifest.screenMappings) {
    lines.push(`SCR ${s.id} "${s.label}" [${s.components.join(',')}]`);
    if (s.patterns.length > 0) lines.push(`  PAT ${s.patterns.join(' ')}`);
  }

  return lines.join('\n');
}
