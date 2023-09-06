const { defineConfig } = require('@vue/cli-service');
const { GeneratePlugin, GenerateDevServerPlugin } = require('./plugin/GenerateProjectConfigPlugin');
const path = require('path');
// process.env.NODE_ENV = 'production';
const child_process = require('child_process');
const isDev = process.env.NODE_ENV === 'development';
const isTargetDev = process.env.VUE_APP_TARGET_ENV !== 'production';
const webpack = require('webpack');
// const bundleConfig = require('./public/dll/bundle.json');
const fs = require('fs');

if (!fs.existsSync('./public/version.txt')) {
  child_process.execSync('git log -n1 --format=format:\\"%h\\" > ./public/version.txt');
}
const moment = require('moment');
const version = fs.readFileSync('./public/version.txt');

process.env.VUE_APP_VERSION_HASH = version;
module.exports = defineConfig({
  assetsDir: 'static',
  productionSourceMap: false,
  transpileDependencies: false,

  pages: {
    index: {
      entry: 'src/main.ts',
      template: path.join(
        __dirname,
        isTargetDev ? 'public/index.dev.html' : 'public/index.prod.html',
      ),
    },
  },

  configureWebpack: config => {
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    };

    config.optimization.moduleIds = 'deterministic';

    // console.log('config', config);
  },

  chainWebpack: config => {
    config.resolve.alias.set('@gm', path.join(__dirname, 'src/gm'));
    config.resolve.modules.clear().add(path.resolve(__dirname, 'node_modules'));
    config.optimization.runtimeChunk('single');
    config.devtool(false);
    // config.plugin('progress').use(ProgressBarPlugin, [
    //   {
    //     format: ' build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
    //     clear: false,
    //   },
    // ]);
    config.plugin('friendly-errors').delete();

    if (!isDev) {
      config.output.chunkFilename(`static/js/chunk/[name].[contenthash:8].js`);
    }
    // config.plugin('library').use(webpack.DllReferencePlugin, [
    //   {
    //     context: path.resolve(__dirname),
    //     manifest: require('./public/dll/library.json'),
    //     name: 'library_lib',
    //   },
    // ]);
    config.optimization.concatenateModules(false);

    config.plugin('enum').use(GeneratePlugin, [
      {
        watch: isDev,
      },
    ]);
    // config.plugin('asni').use(BundleAnalyzerPlugin, []);
    const bundleConfig = [
      {
        name: 'vue',
        value: 'Vue',
        url: 'https://unpkg.com/vue@2.6.14/dist/vue.min.js',
      },
      // {
      //   name: '@vueuse/core',
      //   value: 'VueDemi',
      //   url: 'https://unpkg.com/@vueuse/core@5.3.0/index.iife.min.js',
      // },
      {
        name: 'element-ui',
        value: 'ELEMENT',
        url: 'https://unpkg.com/element-ui@2.15.9/lib/index.js',
      },
      {
        name: 'vue-router',
        value: 'VueRouter',
        url: 'https://unpkg.com/vue-router@3.5.4/dist/vue-router.min.js',
      },
      {
        name: 'echarts',
        value: 'echarts',
        url: 'https://unpkg.com/echarts@5.1.2/dist/echarts.min.js',
      },
      {
        name: 'axios',
        value: 'axios',
        url: 'https://unpkg.com/axios@0.21.4/dist/axios.min.js',
      },
      {
        name: 'moment',
        value: 'moment',
        url: 'https://unpkg.com/moment@2.29.3/min/moment.min.js',
      },
      {
        name: 'moment/locale/zh-cn',
        value: null,
        url: 'https://unpkg.com/moment@2.29.3/locale/zh-cn.js',
      },
      {
        name: 'flv.js',
        value: 'flvjs',
        url: 'https://unpkg.com/flv.js@1.6.2/dist/flv.min.js',
      },
    ];
    const bundle = {};
    const externals = {};
    for (const lib of bundleConfig) {
      bundle[lib.name] = lib.url;
      if (lib.value !== null) {
        externals[lib.name] = lib.value;
      }
    }
    config.externals(externals);
    config.plugin('html-index').tap(args => {
      return args.map(item => {
        item.bundle = bundle;
        item.inject = true;
        return item;
      });
    });
    if (!isDev) {
      config.plugin('extract-css').tap(args => {
        return args.map(item => {
          item.ignoreOrder = true;
          return item;
        });
      });
    }

    config.performance.maxAssetSize(5000000);
    config.performance.maxEntrypointSize(1500000);
  },

  css: {
    extract: !isDev,
    loaderOptions: {
      css: {
        modules: {
          localIdentName: '[local]-[hash:6]',
          auto: path => {
            return /module\.(c|le|sa)ss$/.test(path);
          },
        },
      },
    },
  },

  devServer: {
    allowedHosts: 'all',
    hot: true,
    onBeforeSetupMiddleware: GenerateDevServerPlugin().onBeforeSetupMiddleware,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
      '/resources': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
      '/template': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
    },
  },
  /*
  style-resources-loader
  pluginOptions: {
     'style-resources-loader': {
       preProcessor: 'less',
       patterns: [
         //  全局变量路径
         // path.resolve(__dirname,'./src/styles/utils/index.less'),
         path.resolve(__dirname,'./src/styles/vars.less'),
       ]
     }
   }*/
});
