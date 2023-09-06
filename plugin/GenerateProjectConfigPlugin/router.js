const fs = require('fs')
const fse = require('fs-extra')
const path = require('path');

module.exports = ({ event, generate, call, broadcast }) => {

  const enumPath = generate.enumPath;

  event('join', async () => {
    const enumPath = generate.enumPath;
    const files = fs.readdirSync(enumPath)
    const result = []
    files.forEach((fileName) => {
      const fileNamePath = path.join(enumPath, fileName)
      const state = fs.statSync(fileNamePath);
      if (!state.isFile()) return;
      const fileJson = JSON.parse(fs.readFileSync(fileNamePath, { encoding: 'utf8' }))
      fileJson.name = fileName.replace(/\..+$/, '')
      result.push(fileJson)
    })
    return result;
  })

  call('get_enum', (fileName) => {
    const fileNamePath = path.join(enumPath, `${fileName}.json`)
    return JSON.parse(fs.readFileSync(fileNamePath, { encoding: 'utf8' }))
  })

  call('update_enum', (fileName, fileContext) => {
    fse.outputFile(path.join(generate.enumPath, `${fileName}.json`), JSON.stringify(fileContext, null, '\t'))
    broadcast('update_enum', {
      fileName, fileContext
    })
  })


}

