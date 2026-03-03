import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Run `ANALYZE=true npm run build` to generate bundle analysis reports.
const analyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  experimental: {
    // typedRoutes: true, // enable when app routes are more complete
  },
};

export default analyze(withNextIntl(nextConfig));
