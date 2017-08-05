const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const replace = require('replace')
const inquirer = require('inquirer')

// show cli menu with few options
const updateText = 'update project'
inquirer.prompt([{
    type: 'list',
    name: 'name',
    choices: ['component', 'page', updateText],
    message: 'What do you want to create?',
}])
// show prompt depending on users decision
.then(function ({name}) {
    console.log('name: ', name);
    switch (name) {
        case 'component':
            inquirer
            .prompt([{
                name: 'name',
                type: 'input',
                message: 'component name',
            }])
            .then(input => createComponent(input.name))
            break;
        case 'page':
            inquirer
            .prompt([{
                name: 'name',
                type: 'input',
                message: 'page file name?',
            }])
            .then(({name: pageName}) => {
                inquirer
                .prompt([{
                    name: 'path',
                    type: 'input',
                    message: 'routing path(no first slash)?',
                }])
                .then(({path}) => createPage(pageName, path))
            })
            break;
        case updateText:
            // shell.exec('git remote add upstream https://github.com/developer-expirience/boilerplate')
            shell.exec('git pull upstream master --allow-unrelated-histories')
            shell.exec('yarn')
            shell.echo('😎  all done 😎')
            break;
        default:
            break;
    }
});

/**
 * Copy files from folder and replace parts of text and file name
 * @param {string} folderPath what to copy
 * @param {string} replaceWhat what to replace
 * @param {string} replaceText replacement text
 * @param {string} outputPath where to put folder
 */
function copyFolderAndReplace(folderPath, replaceWhat, replaceText, outputPath) {
    try {
        fs.readdir(folderPath, (err, files) => {
            if (err) throw err
            // 1) create folder
            fs.mkdir(`${outputPath}/${replaceText}`, err => {
            // 2) copy + paste files from folder
                files.forEach(file => {
            // 3) replace text in each file and rename it
                    fs.readFile(folderPath + '/' + file, 'utf8', function (err, data) {
                        if (err) return console.log(err);
                        const regex = new RegExp(replaceWhat, "g")
                        const fileText = data.replace(regex, replaceText);
                        const fileName = file.replace(regex, replaceText);
                        fs.writeFile(`${outputPath}/${replaceText}/${fileName}`, fileText, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });
                    });
                })
            })
        })
    } catch(e) {
        // TODO
        console.log(e);
        if (e.code = 'EEXIST') throw e
    }
}

function createPage(pageName, routePath) {
    const hook = "// ⚠️ Hook for cli! Do not remove 💀"
    const folderName = pageName
    const folderPath = path.resolve(__dirname, '../../src/browser/pages')
    const templatesPath = path.resolve(__dirname, '../templates/page')
    // add route to 'routes.js'
    replace({
        regex: hook,
        silent: true,
        paths: [path.resolve(__dirname, '../../src/browser/routes.js')],
        // replace 'hook' text with route info, and add hook text again afterwards
        replacement: `{ path: '${routePath}', component: require('browser/pages/${pageName}') },\n${hook}`,
    })
    // copy+paste page template folder to 'pages' directory
    copyFolderAndReplace(templatesPath, 'PageName', pageName, folderPath)

}

function createComponent(componentName) {
    const templatesPath = path.resolve(__dirname, '../templates/component')
    const folderPath = path.resolve(__dirname, '../../src/browser/components/' + componentName)
    copyFolderAndReplace(templatesPath, 'ComponentName', componentName, folderPath)
}