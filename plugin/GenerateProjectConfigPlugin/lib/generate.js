const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { enumTemplate } = require('./template');
const utils = require('./utils');
const { sync: delSync } = require('del');

class GenerateProjectConfigPlugin {
  compiler = null;
  name = 'GenerateProjectConfigPlugin';

  watchPath = '';
  generateJsContext = '';

  constructor(options = {}) {
    this.options = {
      // 配置文件文件夹
      configPath: 'config',
      // 声明文件文件夹
      generatePath: '.generate',
      // 输出文件路径
      outputFile: '/static/js/project.js',

      watch: false,
      ...options,
    };
  }

  apply(compiler) {
    this.compiler = compiler;
    const { Compilation } = compiler.webpack;
    const { RawSource } = compiler.webpack.sources;
    this.watchPath = path.join(compiler.context, this.options.configPath);
    // 编译器初始化时
    compiler.hooks.initialize.tap(this.name, (...args) => this.handleCompilerInitialize(...args));
    // 侦听新的一次初始化编译事件
    compiler.hooks.thisCompilation.tap(this.name, compilation => {
      // 侦听资源处理事件
      compilation.hooks.processAssets.tap(
        {
          name: this.name,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        assets => {
          const newHtml = this.appendScriptToHtml(assets['index.html']._valueAsString);
          compilation.updateAsset('index.html', new RawSource(newHtml));
          if (assets[this.options.outputFile]) {
            console.log('更新资源');
            compilation.updateAsset(this.options.outputFile, RawSource(this.generateJsContext));
          } else {
            compilation.emitAsset(this.options.outputFile, new RawSource(this.generateJsContext));
          }
        },
      );
    });
  }

  handleCompilerInitialize(...args) {
    // 删除已经编译的文件
    delSync(`${this.options.generatePath}/**`);
    this.generateDefinitionFile();

    if (this.options.watch) {
      // 侦听配置文件
      console.log('开启了文件侦听,路径:', path.join(this.watchPath, 'enum'));
      fs.watch(
        path.join(this.watchPath, 'enum'),
        utils.debounce(this.generateDefinitionFile.bind(this)),
      );
    }
  }

  checkGenerate(files) {
    if (files === undefined) return true;
    let entries = files.entries();
    let value = entries.next();
    while (!value.done) {
      const file = value.value;
      if (file.indexOf(this.watchPath) !== -1) {
        console.log('文件变更了');
        return true;
      }
      value = entries.next();
    }
    return false;
  }

  appendScriptToHtml(html) {
    const index = html.indexOf('</title>');
    if (index === -1) throw new Error('未找到标签');
    const script = `<script defer="defer" src="${this.options.outputFile}"></script>`;
    return html.substring(0, index + 8) + script + html.substring(index + 8);
  }

  generateDefinitionFile() {
    this.generateJsContext = `(function(){\nif(typeof window.E === 'undefined') window.E = {};\n`;
    const enumDirPath = path.join(this.compiler.context, this.options.configPath, 'enum');
    const tsDefDirPath = path.join(this.compiler.context, '.generate');
    const filesnames = fs.readdirSync(enumDirPath);
    filesnames.forEach(moduleName => {
      if (!/\.json$/.test(moduleName)) return;
      const nsName = moduleName.replace('.json', '');
      const code = this.generateEnum(nsName, path.join(enumDirPath, moduleName));
      const codePath = path.join(tsDefDirPath, `${nsName}.d.ts`);
      // console.log('生成了声明文件:', codePath);
      fse.outputFileSync(codePath, code, {});
    });
    this.generateJsContext += `\n}());`;
    if (!this.options.watch) {
      const contentHash = utils.hashCode(this.generateJsContext);
      this.options.outputFile = `/static/js/project.${contentHash}.js`;
    }
  }

  generateEnum(moduleName, filename) {
    const config = require(filename);
    this.generateJsContext += `if(typeof E.${moduleName} === 'undefined') E.${moduleName} = {};\n`;
    let currentName = moduleName;
    const enumDefinition = config.enums
      .map(enumInfo => {
        let value = 0;
        const enumName = enumInfo.name;
        currentName = `E.${moduleName}.${enumName}`;
        this.generateJsContext += `if(typeof ${currentName} === 'undefined') ${currentName} = {};\n`;
        this.generateJsContext += `if(typeof ${currentName}Map === 'undefined') ${currentName}Map = new Map();\n`;
        this.generateJsContext += `if(typeof ${currentName}Option === 'undefined') ${currentName}Option = new Array();\n`;
        const enumItem = enumInfo.items
          .map(enumItem => {
            const currentValue = enumItem.value !== undefined ? enumItem.value : value;
            value = currentValue + 1;
            this.generateJsContext += `${currentName}.${enumItem.key}=${currentValue}\n`;
            this.generateJsContext += `${currentName}Map.set(${currentValue},'${enumItem.label}')\n`;
            this.generateJsContext += `${currentName}Option.push({
              label:'${enumItem.label}',
              value:${currentValue},
            })\n`;
            return `\t\t\t\t/** ${enumItem.label} */
\t\t\t\t${enumItem.key}=${currentValue},`;
          })
          .join('\n');
        return utils.genTemplate(enumTemplate, { enumName, enumItem, describe: enumInfo.describe });
      })
      .join('\n');

    return `declare global {
  namespace E.${moduleName.toLowerCase()} {
    ${enumDefinition}
  }
}
export {}`;
  }
}

module.exports = GenerateProjectConfigPlugin;
