const { getLocalBranch } = require('../../lib/utils')
const Table = require('cli-table3');
const chalk = require('chalk')
const path = require('path')
module.exports = {
  init: async function () {
    let reop = await getLocalBranch()
    const table = new Table({
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
      head: [chalk.cyan('仓库'), chalk.cyan('分支')],
      colWidths: [20, 40]
    });
    table.push(...reop.map((it, i) => ([ chalk.green(path.basename(it.reop)), chalk.green(it.branch) ])))
    console.log(table.toString())
  }
}