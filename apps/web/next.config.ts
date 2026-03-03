import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Recommended: enable SWC minification
  experimental: {
    // typedRoutes: true, // enable when app routes are more complete
  },
};

export default withNextIntl(nextConfig);
