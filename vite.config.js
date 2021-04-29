import Vue from '@vitejs/plugin-vue';
import ViteComponents from 'vite-plugin-components';
import ViteImages from 'vite-plugin-vue-images';

module.exports = {
  resolve: {
    alias: {
      tslib: 'tslib/tslib.es6.js',
    },
  },
  assetsInlineLimit: 1,
  assetsInclude:  /\.(pdf|jpg|png)$/,
  plugins: [
    Vue(),
    ViteComponents(),
    ViteImages(),
  ],
};
