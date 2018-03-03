var fs = require('fs')
var touch = require("touch")
var shell = require('shelljs')
var nodeCLI = require("shelljs-nodecli")
var checkEnv = require('../checkEnvironment.js')

// check that required libraries are installed
checkEnv()

// set up sqlite development and test databases
shell.echo('creating local databases...')
touch('test.sqlite')
touch('development.sqlite')
shell.exec('npm run migrate')
// test application
shell.echo('testing application...')
shell.exec('npm run test')
shell.echo('Setting up is complete!')
shell.echo('Run "npm start" or "yarn start" and start hacking.')