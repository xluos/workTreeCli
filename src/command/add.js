const inquirer = require('inquirer');
const fs = require('fs')
const simpleGit = require('simple-git')();
const Configstore = require('configstore');
const CONFIG = new Configstore('WORKTERRCLI');

function isGitRepo (path) {
  const done = this.async();
  let Git
  if(fs.existsSync(`${path}/.git`)) {
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
    CONFIG.set('reop', [
      ...reop,
      {
        path: path,
        remarks: ''
      }
    ])
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
      console.log(`添加仓库：${answers.path} 成功`);
    })
  }
}