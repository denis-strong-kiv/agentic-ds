// ─── Shared filter for CSS outputs ────────────────────────────────────────────
// Excludes component-level tokens (badge, button, card, input, nav) and
// tokens with unresolved object values ([object Object]) after CVA migration.

export const COMPONENT_NAMESPACES = ['badge', 'button', 'card', 'input', 'nav'];

export function toCssValue(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') return null;
  return String(value);
}

export function filterCssTokens<T extends { path: string[]; value: unknown }>(
  tokens: T[]
): T[] {
  return tokens.filter(
    (token) =>
      !COMPONENT_NAMESPACES.includes(token.path[0] as string) &&
      toCssValue(token.value) !== null
  );
}
