import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales — add more as messages/*.json files are created
  locales: ['en', 'ar'] as const,

  // Default locale (used when no locale is detected)
  defaultLocale: 'en',

  // Locale prefix strategy:
  // 'as-needed' → /en path is hidden (just /), other locales get prefix
  localePrefix: 'as-needed',

  // Locale-aware path names (optional - for translated slugs)
  // pathnames: { '/about': { ar: '/عن', fr: '/a-propos' } },
});

export type Locale = (typeof routing.locales)[number];

/** RTL locales — determines `dir` attribute on `<html>` */
export const RTL_LOCALES: Set<Locale> = new Set(['ar']);

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
}
