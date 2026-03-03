/**
 * URL pattern matching helper.
 *
 * Pattern format: "METHOD /path/:param"
 * Example: "GET /brands/:id/tokens.css"
 *
 * Returns a params object on match, null on no match.
 * Params object is empty ({}) for routes with no path parameters.
 */
export function matchRoute(
  method: string,
  pathname: string,
  pattern: string,
): Record<string, string> | null {
  const spaceIdx = pattern.indexOf(' ');
  const routeMethod = pattern.slice(0, spaceIdx);
  const routePath = pattern.slice(spaceIdx + 1);

  if (method !== routeMethod) return null;

  // Convert :param segments to named capture groups
  const regexStr =
    '^' +
    routePath.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '(?<$1>[^/]+)') +
    '$';

  const match = pathname.match(new RegExp(regexStr));
  if (!match) return null;

  return match.groups ?? {};
}
