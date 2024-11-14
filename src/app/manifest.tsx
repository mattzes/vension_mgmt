import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vension Management System',
    short_name: 'VMS',
    description: 'Verwalte dein Wildfleisch in deinen Gefriertruhen',
    start_url: '/inventory',
    display: 'standalone',
    background_color: '##60a5fa',
    theme_color: '#000000',
    icons: [
      {
        src: '/app_logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/app_logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
