/**
 * THIS IS OBSOLETE AND NOT USED ANYWHERE
*/

var shell = require('shelljs');
var nodeCLI = require("shelljs-nodecli");
var checkEnv = require('../checkEnvironment.js')

// TODO add comments
checkEnv()

shell.exec('git pull')
nodeCLI.exec('yarn')

shell.echo('installing dependencies...')
nodeCLI.exec('npm install')
shell.env.NODE_ENV = "production"
shell.exec('sequelize db:migrate')
// TODO set env variables here // TODO check if we need to do it second time
shell.exec('NODE_ENV=production')
shell.exec('webpack --config ./config/targets.config.js --display-error-details')
shell.exec('npm rebuild node-sass')
shell.exec('pm2 stop all')
shell.exec('pm2 start dist/server.js --node-args=\'--expose-gc\'')
// shell.exec('pm2 monit')