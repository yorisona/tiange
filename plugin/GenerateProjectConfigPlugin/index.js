const path = require('path');
const express = require('express');
const { GenerateSocket } = require('./lib/socket');
const GeneratePlugin = require('./lib/generate');
const RouterConfig = require('./router');
module.exports = exports = {};


const defaultOptions = {
  rootDir: process.cwd(), configPath: 'config',
};

class _GeneratePlugin {

  onBeforeSetupMiddleware;

  _devServer;

  configPath;
  enumPath;

  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
    this._initOptions();
    this._socketServer = new GenerateSocket(this);
    this.onBeforeSetupMiddleware = (devServer) => {
      this._devServer = devServer;
      this._initRouter(devServer.app);
      this._initWsRouter();
    };
    this._socketServer.apply(RouterConfig);

  }

  _initWsRouter() {
    this._devServer.webSocketProxies.push(this._socketServer);
  }

  _initOptions() {
    this.configPath = path.join(this.options.rootDir, this.options.configPath);
    this.enumPath = path.join(this.configPath, 'enum');
  }

  _initRouter(app) {
    const router = express.Router();


    router.get('/editor', (req, res) => {
      res.sendFile(path.join(__dirname, 'static/editor.html'));
    });

    app.use('/plugins/generate', router);

  }


};

exports.GenerateDevServerPlugin = (options) => {
  return new _GeneratePlugin(options);
};

exports.GeneratePlugin = GeneratePlugin;
