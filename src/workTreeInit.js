'use strict';

const parseArgs = require('minimist')
const CONFIG = require('./config')

var cli = {};

function getcmd(argv) {
    let res;
    const cmds = argv._;

    Object.keys(argv).some(function (key) {
        if (CONFIG.CLI_PARAMS[key]) {
            res = CONFIG.CLI_PARAMS[key];
            return true;
        }
        return false;
    });
    if (!res) {
        cmds.some((key) => {
            if (CONFIG.CLI_PARAMS[key]) {
                res = CONFIG.CLI_PARAMS[key];
                return true;
            }
            return false;
        });
    }

    return res;
}

function initCli() {
    
    const COMMANDS = CONFIG.COMMANDS;
    COMMANDS.forEach(function (cmd) {  
        cli[cmd] = require(`./command/${cmd}.js`);
    }
    )
}

function execCli() {
    const argv = parseArgs(process.argv.slice(2));
    // console.log(argv);

    let cmd = getcmd(argv);

    // console.log(cmd);
    
    if(!cli[cmd]) {
        cmd = CONFIG.DEFAULT_CLI;
    }
    
    cli[cmd].init(argv);
}

module.exports = {
    init: function (){
        
        initCli();
        execCli();

    }
}