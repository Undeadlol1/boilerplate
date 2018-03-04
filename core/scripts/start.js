/**
 * THIS IS OBSOLETE AND NOT USED ANYWHERE
*/

var shell = require('shelljs');
var nodeCLI = require("shelljs-nodecli");
var checkEnv = require('../checkEnvironment.js')

// TODO add comments

shell.echo('installing dependencies...')
nodeCLI.exec('yarn')
checkEnv()
shell.echo('executing post-install scripts...')
shell.exec('npm rebuild node-sass', {silent: true})
shell.echo('wait for webpack to compile files...')
nodeCLI.exec(
  "concurrently",
  "\"NODE_ENV=development "
  + "webpack --config ./config/targets.config.js --display-error-details --hide-modules\" "
  + "\"nodemon --watch dist dist/server.js\""
);