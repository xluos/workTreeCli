'use strict';

const msee = require('msee');
const path = require('path');
const fs = require('fs');

module.exports = {
  init: function (args) {
    let cmd = 'help';

    const file = path.join(__dirname, '../../doc', `${cmd}.md`);
    let doc;

    if (fs.existsSync(file)) {
      doc = msee.parseFile(file);
      console.log(doc);
    } else {
      console.log('oh! I can\'t help you');
    }
  }
}