const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    library: [
      'vue',
      '@vueuse/core',
      'axios',
      'canvas-nest.js',
      'core-js',
      'decimal.js',
      'decimal.js-light',
      'echarts',
      'html2canvas',
      'miment',
      'moment',
      'pubsub-js',
      'qrcode.vue',
      'query-string',
      'swiper',
      '@vue/composition-api',
      'vuex',
      'vuex-persist',
      'vxe-table',
      'element-ui',
    ],
  },
  output: {
    path: path.join(__dirname, 'public/dll'),
    publicPath: '/dll/',
    filename: '[name].[chunkhash:8].js',
    library: '[name]_lib',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      context: path.join(__dirname),
      path: path.join(__dirname, 'public/dll', '[name].json'),
      name: '[name].lib',
    }),
    new AssetsPlugin({
      filename: 'bundle.json',
      path: path.join(__dirname, 'public/dll'),
    }),
  ],
};
