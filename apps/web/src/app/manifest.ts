import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NachUI',
    short_name: 'NachUI',
    description:
      'A design system you own: UI, AI and layout elements for React, copied into your repository as plain source.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0c0f',
    theme_color: '#0b0c0f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
