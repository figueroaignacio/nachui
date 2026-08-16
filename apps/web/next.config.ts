import { withContentCollections } from '@content-collections/next';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  typedRoutes: true,
  async rewrites() {
    // Appending `.md` to a docs URL serves its raw markdown source, which
    // `llms.txt` links to. Kept as rewrites so the URLs stay under /docs.
    return [
      {
        source: '/:locale(en|es)/docs.md',
        destination: '/api/docs-md/:locale',
      },
      {
        source: '/:locale(en|es)/docs/:slug*.md',
        destination: '/api/docs-md/:locale/:slug*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:locale(en|es)/docs/components/:path*',
        destination: '/:locale/docs/elements/ui/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|es)/docs/layout/:path*',
        destination: '/:locale/docs/elements/layout/:path*',
        permanent: true,
      },
      {
        source: '/docs/components/:path*',
        destination: '/docs/elements/ui/:path*',
        permanent: true,
      },
      {
        source: '/docs/layout/:path*',
        destination: '/docs/elements/layout/:path*',
        permanent: true,
      },
    ];
  },
  outputFileTracingIncludes: {
    '/': ['../../packages/ui/src/samples/**'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
};

export default withContentCollections(withNextIntl(nextConfig));
