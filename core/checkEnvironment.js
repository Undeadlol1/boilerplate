var shell = require('shelljs');

module.exports = function () {

    // TODO do i actually need this? Dont we install this via yarn?
    var dependencies = ['git', 'yarn', 'webpack', 'node', 'npm']

    dependencies.forEach(function(name) {
        if (!shell.which(name)) {
            shell.echo('You need to install ' + name + '!');
            shell.exit(1);
        }
    })

    if (!shell.which('sequelize')) {
        shell.echo('You forgot to install sequelize-cli!');
        shell.exit(1);
    }
}
