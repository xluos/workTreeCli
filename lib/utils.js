const figlet = require('figlet');
const chalk = require('chalk');
const simpleGit = require('simple-git')();
const fs = require('fs');
const Configstore = require('configstore');
const CONFIG = new Configstore('WORKTERRCLI');


function Filters(branchList, key) {
  const keys = key.split(/\s+/)
  let list = [...branchList]
  for (const k of keys) {
    list = list.filter(item => item.indexOf(k) !== -1)
  }
  return list
}

/**
 * 打印Logo
 *
 */
function printLogo () {
  const data = figlet.textSync(`work Tree CLI`, {
    kerning: "full"
  });
  console.log(chalk.blue(data))
}

/**
 * 获取Git仓库当前分支
 *
 * @param {*} path 仓库路径
 * @returns 分支
 */
function getBranch (path) {
  return new Promise(function (resolve, reject) {
    simpleGit.cwd(path).branchLocal(function (err, val) {
      if (err) {
        reject(err)
      }
      resolve(val.current)
    })
  })
}

/**
 * 创建Git WorkTree 
 *
 * @param {*} { sPath, tPath, branch } 源路径 目标路径 检出分支
 * @returns
 */
function gitWorkTree ({ sPath, tPath, branch }) {
  return new Promise(function (resolve, reject) {

    simpleGit.cwd(sPath).raw([
      'worktree',
      'add',
      '--checkout',
      tPath,
      branch
    ], function (err, val) {
      if (err) {
        reject(err)
      }
      resolve(val)
    })
  })
}

/**
 * 获取Git仓库所有本地分支
 *
 * @param {*} reop 仓库路径
 * @returns 分支数组
 */
function getBranchList (reop) {
  return new Promise(function (resolve, reject) {
    simpleGit.cwd(reop).branchLocal(function (err, val) {
      if (err) {
        reject(err)
      }
      resolve(val.all)
    })
  })
}

/**
 * 判断是否是路径
 *
 * @param {*} path 路径
 * @returns
 */
function isPath (path) {
  return fs.existsSync(path)
}

/**
 * 判断是否是Git仓库
 *
 * @param {*} path 仓库路径 
 * @returns 
 */
function isGitPath (path) {
  return fs.existsSync(`${path}/.git`)
}

/**
 * 添加仓库到存储空间
 *
 * @param {*} path 仓库路径
 */
function addReop (path) {
  const reop = CONFIG.has('reop') ? CONFIG.get('reop') : []
  CONFIG.set('reop', [
    ...reop,
    {
      path,
      remarks: ''
    }
  ])
}

/**
 * 创建搜索分支函数
 * 通过闭包保存分支信息避免每次查询的时间消耗
 *
 * @returns
 */
function createSearchBranch () {
  let branchList = []
  let isOne = false
  return async function (data, val) {
    let reop = data.sPath;
    if (!isOne) {
      branchList = await getBranchList(reop)
      isOne = true
    }
    return !val ? branchList : Filters(branchList, val)
  }
}

/**
 * 创建搜索仓库函数
 * 通过闭包保存仓库信息避免每次查询的时间消耗
 *
 * @returns
 */
function createSearchReop () {
  let reop = []
  let isOne = false
  return async function (data, val) {
    if (!isOne) {
      reop = (await getLocalBranch()).map(item => `${item.branch}(${item.reop})`)
      isOne = true
    }
    return !val ? reop : Filters(reop, val)
  }
}

async function getLocalBranch () {
  const reop = CONFIG.has('reop') ? CONFIG.get('reop') : []
    let branch = []
    for (const item of reop) {
      branch.push(getBranch(item.path))
    }
    branch = await Promise.all(branch)
    
    return reop.map((item, i) => ({
      reop: item.path,
      branch: branch[i]
    }))
}

/**
 * 创建搜索分支函数
 * 通过闭包保存分支信息避免每次查询的时间小号
 *
 * @returns
 */
function createSearchBranch () {
  let branchList = []
  let isOne = false
  return async function (data, val) {
    let reop = data.sPath;
    if (!isOne) {
      branchList = await getBranchList(reop)
      isOne = true
    }
    return !val ? branchList : Filters(branchList, val)
  }
}

module.exports = {
  createSearchBranch,
  addReop,
  isGitPath,
  isPath,
  getBranchList,
  gitWorkTree,
  getBranch,
  printLogo,
  getLocalBranch,
  createSearchReop,
}