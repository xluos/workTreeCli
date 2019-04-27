const fs = require('fs-extra');
const Configstore = require('configstore');
const CONFIG = new Configstore('WORKTERRCLI');
const chalk = require('chalk')

module.exports = {
  init: function () {
    console.log(chalk.blue('path: ' + CONFIG.path));
    
    console.log(JSON.stringify(fs.readJSONSync(CONFIG.path), null, 2));
    
  }
}