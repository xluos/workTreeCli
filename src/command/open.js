const shell = require('shelljs')
const inquirer = require('inquirer');
const { createSearchReop } = require('../../lib/utils')

module.exports = {
  init: function () {
    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
    inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'reop',
        message: '请选择要打开的分支',
        source: createSearchReop(),
        pageSize: 5,
      }
    ]).then(async ({ reop }) => {
      try {
        reop = reop.match(/\((.*)\)/)[1]
        shell.exec(`code ${reop}`)
      } catch (error) {
        console.log(error);
      }
    })
  }
}