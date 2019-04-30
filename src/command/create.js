const inquirer = require('inquirer');
const fse = require('fs-extra')
const { 
  isGitPath, 
  isPath,
  gitWorkTree, 
  addReop,
  createSearchBranch,
} = require('../../lib/utils')
const CLI = require('clui');
const Spinner = CLI.Spinner;
 
const countdown = new Spinner('正在创建。。。。', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
 
function getNewPath () {
  const path = process.cwd()
  let i = 2;
  while (isPath(`${path}${i}`)) i++;
  return `${path}${i}`;
}

module.exports = {
  init: function () {
    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
    inquirer.prompt([
      {
        type: 'input',
        name: 'sPath',
        message: '请输入源仓库路径',
        default: process.cwd(),
        validate: val => isGitPath(val) ? true : '不是目录或Git仓库'
      },
      {
        type: 'input',
        name: 'tPath',
        message: '请输入目标仓库路径',
        default: getNewPath(),
        validate: function (path) {
          fse.ensureDirSync(path)
          return isPath(path) ? true : '创建目录失败'
        }
      },
      {
        type: 'autocomplete',
        name: 'branch',
        message: '请选择要检出的分支',
        source: createSearchBranch(),
        pageSize: 5,
        // TODO  后续优化为输入本地没有的分支时创建分支
        // suggestOnly: true  
      }
    ]).then(async ({sPath, tPath, branch}) => {
      countdown.start()
      try {
        await gitWorkTree({sPath, tPath, branch})
        countdown.stop()
        addReop(tPath)
        console.log(`创建：${tPath} 成功`);
      } catch (error) {
        countdown.stop()
        console.log(error);
      }
    })
  }
}