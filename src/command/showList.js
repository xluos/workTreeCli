const Configstore = require('configstore');
const CONFIG = new Configstore('WORKTERRCLI');
const { getBranch } = require('../../lib/utils')
module.exports = {
  init: async function () {
    const reop = CONFIG.has('reop') ? CONFIG.get('reop') : []
    let branch = []
    for (const item of reop) {
      branch.push(getBranch(item.path))
    }

    branch = await Promise.all(branch)
    console.log(branch);
    
    console.table(reop.map((it, i) => ({ path: it.path, branch: branch[i]})), ['path', 'branch'])
  }
}