/**
 * THIS IS OBSOLETE AND NOT USED ANYWHERE
*/
var shell = require('shelljs');
var nodeCLI = require("shelljs-nodecli");
var checkEnv = require('../checkEnvironment.js')

// TODO add comments

checkEnv()
shell.exec('clear')
shell.exec('NODE_ENV=test')
shell.env.NODE_ENV = 'test'
shell.echo(shell.env)
shell.exec('webpack --config ./config/tests.config.js --display-error-details --hide-modules')
// nodeCLI.exec("webpack") //, "--config ./config/tests.config.js --display-error-details --hide-modules"