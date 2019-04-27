const fs = require('fs');
const path = require('path');
module.exports = {
  init: function () {
    const version = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8')).version;
    console.log(`version: ${version}`)
  }
}