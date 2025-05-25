import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression2';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname);

  return {
    base: '/',
    plugins: [
      compression(),
      react(),
      VitePWA({
        disable: env.VITE_PWA_ENABLED !== 'true',
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'safari-pinned-tab.svg',
          'favicon-32x32.png',
          'favicon-16x16.png',
          'sitemap.xml',
        ],
        manifest: {
          id: 'https://bearflix.fun',
          name: 'BearFlix',
          short_name: 'BearFlix',
          description: 'Stream  Movies and Series in 4K for Free',

          background_color: '#000000',
          theme_color: '#000000',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use './src/js/scss/' as *;
            @use './src/js/scss/_variables.scss' as *;
            @use './src/js/scss/_index.scss' as *;
            @use './src/js/scss/_breakpoint.scss' as *;
            @use './src/js/scss/_mixin.scss' as *;
          `,
        },
      },
    },
     workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.themoviedb\.org\/3\//,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'tmdb-api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 6, // 6 hours
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: ({ url }) => url.origin === self.location.origin,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'local-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
        },
      },
    ],
  },
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
           
          },
        },
      },
    },
  };
});
