const inquirer = require('inquirer')
var replace = require('replace')
const path = require('path')
const fs = require('fs')

// TODO comments
// TODO refactor

inquirer.prompt([{
    type: 'list',
    name: 'name',
    choices: ['component', 'page'],
    message: 'What do you want to create?',
}])
.then(function ({name}) {
    if (name == 'component') {
        inquirer
        .prompt([{
            type: 'input',
            name: 'name',
            message: 'component name',
        }])
        .then(input => createComponent(input.name))
    }
    else {
        inquirer
        .prompt([{
            type: 'input',
            name: 'name',
            message: 'page file name?',
        }])
        .then(({name: pageName}) => {
            inquirer
            .prompt([{
                type: 'input',
                name: 'path',
                message: 'routing path(no first slash)?',
            }])
            .then(({path}) => createPage(pageName, path))
        })
    }
});

function createPage(pageName, routePath) {
    var replace = require("replace");
    var hook = "// ⚠️ Hook for cli! Do not remove 💀"
    const folderName = pageName
    const folderPath = path.resolve(__dirname, '../../src/browser/pages/' + folderName)

    replace({
        regex: hook,
        replacement: `{ path: '${routePath}', component: require('browser/pages/${pageName}') },\n${hook}`,
        paths: [path.resolve(__dirname, '../../src/browser/routes.js')],
        silent: true,
    })

    try {
        fs.mkdir(folderPath, err => {
            if (err) return console.log(err);
            fs.readFile(path.resolve(__dirname, '../templates/page/page.jsx'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/PageName/g, folderName);

                fs.writeFile(`${folderPath}/${folderName}.jsx`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
            fs.readFile(path.resolve(__dirname, '../templates/page/index.js'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/PageName/g, folderName);

                fs.writeFile(`${folderPath}/index.js`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
            fs.readFile(path.resolve(__dirname, '../templates/page/test.js'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/PageName/g, folderName);

                fs.writeFile(`${folderPath}/${folderName}.test.js`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
            fs.readFile(path.resolve(__dirname, '../templates/page/styles.scss'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/PageName/g, folderName);

                fs.writeFile(`${folderPath}/${folderName}.scss`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
        })
    } catch(e) {
        // TODO
        console.log(e);
        if (e.code = 'EEXIST') throw e
    }

}

function createComponent(componentName) {
    const folderName = componentName
    const folderPath = path.resolve(__dirname, '../../src/browser/components/' + folderName)

    try {
        fs.mkdir(folderPath, err => {
            if (err) return console.log(err);
            fs.readFile(path.resolve(__dirname, '../templates/component/component.jsx'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/ComponentName/g, folderName);

                fs.writeFile(`${folderPath}/${folderName}.jsx`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
            fs.readFile(path.resolve(__dirname, '../templates/component/index.js'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/ComponentName/g, folderName);

                fs.writeFile(`${folderPath}/index.js`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
            fs.readFile(path.resolve(__dirname, '../templates/component/test.js'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/ComponentName/g, folderName);

                fs.writeFile(`${folderPath}/${folderName}.test.js`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
            fs.readFile(path.resolve(__dirname, '../templates/component/styles.scss'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                var result = data.replace(/ComponentName/g, folderName);

                fs.writeFile(`${folderPath}/${folderName}.scss`, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
        })
    } catch(e) {
        // TODO
        console.log(e);
        if (e.code = 'EEXIST') throw e
    }
}