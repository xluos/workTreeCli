const figlet = require('figlet');
const chalk = require('chalk');
const simpleGit = require('simple-git')();

module.exports = {
  printLogo: function () {
    const data = figlet.textSync(`work Tree CLI`, {
      kerning: "full"
    });
    console.log(chalk.blue(data))
  },
  getBranch: function (path) {
    return new Promise(function(resolve, reject) {

      simpleGit.cwd(path).branchLocal(function(err, val) {
        if(err) {
          reject(err)
        }
        console.log(val.current)
        resolve(val.current)
      })
    })
  }
}