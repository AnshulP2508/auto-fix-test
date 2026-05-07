const { withSentryConfig } = require('@sentry/nextjs');

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production' || process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: false,
  experimental: {
    instrumentationHook: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' }
        ]
      }
    ];
  }
};

module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || 'betterbugs-test',
  project: process.env.SENTRY_PROJECT_FRONTEND || 'javascript-nextjs',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  hideSourceMaps: isProduction,
  // Do NOT set disableLogger here — we want Sentry logs to reach the dashboard
  // tunnelRoute: '/monitoring-tunnel',
  automaticVercelMonitors: false,
  silent: !process.env.SENTRY_AUTH_TOKEN
});
