const inquirer = require('inquirer');
const simpleGit = require('simple-git')()
function isGitRepo (path) {
  const done = this.async();
  let Git
  try {
    Git = simpleGit.cwd(path)
  } catch (error) {
    done('该路径不是一个Git仓库', false)
  }
  Git.branchLocal(function (err, val) {
    if (err) {
      done(`error: ${err}`, false)
    }
    console.log('-----------------------')
    
    console.log(JSON.stringify(val, null, 2));
    done(null, true)
  })
}

module.exports = {
  init: function () {
    inquirer.prompt([
      {
        type: 'input',
        name: 'path',
        message: '请输入仓库路径',
        default: process.cwd(),
        validate: isGitRepo
      }
    ]).then((answers) => {
      console.log('结果为:')
      console.log(answers)
    })
  }
}