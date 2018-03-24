var touch = require("touch")
var shell = require('shelljs')
var isDocker = require('is-docker')
var checkEnv = require('../checkEnvironment.js')

// Check that required libraries are installed.
// NOTE: in docker all libraries are certainly installed.
if (!isDocker()) checkEnv()

// set up sqlite development and test databases
shell.echo('creating local databases...')
touch('test.sqlite')
touch('development.sqlite')
shell.exec('npm run migrate')
// test application
// NOTE: exclude testing while building docker image because it may break the process.
if (!isDocker()) shell.echo('testing application...')
if (!isDocker()) shell.exec('npm run test')
shell.echo('Setting up is complete!')
shell.echo('Run "npm start" or "yarn start" and start hacking.')