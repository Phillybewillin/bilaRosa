import purgecss from '@fullhuman/postcss-purgecss';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  plugins: [
    isProduction &&
      purgecss({
        content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
        safelist: [
          /^swiper/,              // Swiper.js
          /^Toastify/,            // react-toastify
          /^react-select/,        // react-select
          /^embla/,               // embla-carousel
          /^szh-menu/,            // @szhsin/react-menu (actual class prefix)
          /^szh-menu__/,          // deeper specificity for menu items
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
  ],
};
