const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events');
const fse = require('fs-extra')


module.exports = class Server extends EventEmitter {


  async parseCommand(message) {
    const { operating, options, data } = message;
    console.log('有命令进来了', operating)
    const methods = 'on' + operating.toLowerCase().split('_').map((name) => {
      return name.charAt(0).toUpperCase() + name.substring(1)
    }).join('')
    console.log('转换后的方法名', methods)
    if (this[methods] === undefined) return;

    return this[methods](options, data);
  }


  async onUpdateEnum(options, data) {
    return fse.outputFile(
      path.join(__dirname, '../../config/enum/' + options.name + '.json'),
      JSON.stringify(data)
    )
  }


}