const figlet = require('figlet');
const chalk = require('chalk');
module.exports = {
    init: function () {
        const version = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../package.json'),'utf-8')).version;
        
        
    }
}


module.exports = {
  printLogo: function () {
    const data = figlet.textSync(`work Tree CLI`, {
      kerning: "full"
    });
    console.log(chalk.blue(data))
  }
}