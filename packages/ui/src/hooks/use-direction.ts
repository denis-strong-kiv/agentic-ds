'use client';

import { useEffect, useState } from 'react';

export type Direction = 'ltr' | 'rtl';

/**
 * Returns the current text direction from the nearest ancestor with a `dir` attribute,
 * falling back to the `<html>` element's `dir`, then to `'ltr'`.
 *
 * Reacts to dynamic `dir` attribute changes (e.g. when the brand or locale changes).
 *
 * @example
 * ```tsx
 * function IconChevron() {
 *   const dir = useDirection();
 *   return <ChevronRightIcon style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }} />;
 * }
 * ```
 */
export function useDirection(): Direction {
  const [dir, setDir] = useState<Direction>('ltr');

  useEffect(() => {
    // Read direction from documentElement initially
    const readDir = (): Direction => {
      const htmlDir = document.documentElement.getAttribute('dir');
      return htmlDir === 'rtl' ? 'rtl' : 'ltr';
    };

    setDir(readDir());

    // Observe mutations on <html> for dynamic locale switches
    const observer = new MutationObserver(() => setDir(readDir()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

    return () => observer.disconnect();
  }, []);

  return dir;
}

/**
 * Returns `true` when the current direction is RTL.
 */
export function useIsRtl(): boolean {
  return useDirection() === 'rtl';
}

/**
 * Returns a value based on the current direction.
 * Useful for applying flipped transforms on directional icons.
 *
 * @example
 * ```tsx
 * const flip = useDirectionalValue({ ltr: 'none', rtl: 'scaleX(-1)' });
 * <ChevronRightIcon style={{ transform: flip }} />
 * ```
 */
export function useDirectionalValue<T>(values: { ltr: T; rtl: T }): T {
  const dir = useDirection();
  return values[dir];
}
