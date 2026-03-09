import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Run `ANALYZE=true pnpm build` to generate bundle analysis reports.
const analyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  transpilePackages: ['@travel/ui'],
  experimental: {
    // typedRoutes: true, // enable when app routes are more complete
  },
  webpack: (config) => {
    // Resolve TypeScript .js imports (ESM-style) for transpiled workspace packages
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    };
    return config;
  },
};

export default analyze(withNextIntl(nextConfig));
