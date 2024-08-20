import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import MillionLint from '@million/lint';
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd());

  return {
    base: env.VITE_BASE_URL || '/', 
    plugins: [
      MillionLint.vite({
        rsc: true,
        filter: {
       include: "**/components/*.{js,jsx}",
        },
        optimizeDOM : true , 
      }),
      react(),
      VitePWA({
        disable: env.VITE_PWA_ENABLED !== "true",
        registerType: "autoUpdate",
        workbox: {
          maximumFileSizeToCacheInBytes: 4000000, // 4mb
          globIgnores: ["**ping.txt**"],
        },
        includeAssets: [
        
          "favicon.ico",
          "apple-touch-icon.png",
          "safari-pinned-tab.svg",
        
          "robots.txt",
        
          "favicon-32x32.png",
          "favicon-16x16.png",
          "sitemap.xml",

         
        ],
        manifest: {
          id: "https://www.zilla-xr.xyz/",
          name: "Zilla-XR",
          short_name: "ZillaXR",
          description: "Stream a wide range of Movies and Series up to 4k for Free, Watch Movies online without interuptions and without ads .",
          background_color: "#000000",
          theme_color: "#000000",
          display: "standalone",
          start_url: "https://www.zilla-xr.xyz",
          orientation: "any",
          icons: [
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/ts/src'),
      },
    },
    build: {
      assetsDir: 'assets',
      minify: 'esbuild',
      outDir: 'dist',
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
