import { useState, useEffect } from 'react';
import { getNativeTokens } from '../tokens';
import type { BrandId, ColorMode, NativeTokens } from '../types';

/**
 * React hook that returns resolved native tokens for a brand + color mode.
 *
 * @param brandId  One of 'default' | 'luxury' | 'adventure' | 'eco'
 * @param mode     'light' | 'dark'. When omitted the hook reads the system
 *                 color scheme via the `useColorScheme` hook (react-native) or
 *                 `window.matchMedia` (web/test environments). Falls back to 'light'.
 *
 * @example
 * const tokens = useBrandTokens('luxury');
 * <View style={{ backgroundColor: tokens.color.backgroundDefault }} />
 */
export function useBrandTokens(brandId: BrandId, mode?: ColorMode): NativeTokens {
  const resolvedInitial = mode ?? detectColorScheme();
  const [tokens, setTokens] = useState<NativeTokens>(() =>
    getNativeTokens(brandId, resolvedInitial),
  );

  useEffect(() => {
    if (mode) {
      // Caller controls mode — re-resolve when props change.
      setTokens(getNativeTokens(brandId, mode));
      return;
    }

    // Listen for OS-level preference changes (web / Expo web).
    const mq =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    if (!mq) {
      setTokens(getNativeTokens(brandId, 'light'));
      return;
    }

    const update = () =>
      setTokens(getNativeTokens(brandId, mq.matches ? 'dark' : 'light'));

    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [brandId, mode]);

  return tokens;
}

function detectColorScheme(): ColorMode {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}
