const inquirer = require('inquirer');
const simpleGit = require('simple-git')();
const Configstore = require('configstore');
const CONFIG = new Configstore('WORKTERRCLI');
const { isGitPath, addReop } = require('../../lib/utils');

function isGitRepo (path) {
  const done = this.async();
  let Git
  if(isGitPath(path)) {
    Git = simpleGit.cwd(path)
  } else {
    done('路径不存在或不是一个Git仓库', false)
  }
  
  Git.branchLocal(function (err, val) {
    if (err) {
      done(`error: ${err}`, false)
    }
    const reop = CONFIG.has('reop') ? CONFIG.get('reop') : []
    if (reop.some(item => item.path === path)) {
      done(`仓库已存在`, true)
      return
    }
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
      addReop(answers.path)
      console.log(`添加仓库：${answers.path} 成功`);
    })
  }
}