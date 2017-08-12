const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const replace = require('replace')
const inquirer = require('inquirer')
const upperCaseFirst = require('change-case').upperCaseFirst
const lowerCaseFirst = require('change-case').lowerCaseFirst
const imageToAscii = require('image-to-ascii')

// show cli menu with few options
const launchText = 'launch project'
const updateText = 'update project'
const pageText = 'create page'
const componentText = 'create component'
const apiText = 'create API'
const hook = "// ⚠️ Hook for cli! Do not remove 💀"

imageToAscii(path.resolve(__dirname, '../duck.jpeg'), (err, converted) => {
    // show image
    console.log(err || converted);
    // show cli ui
    inquirer.prompt([{
        type: 'list',
        name: 'name',
        choices: [launchText, componentText, pageText, updateText, apiText],
        message: 'What do you want to do?',
    }])
    // show prompt depending on users decision
    .then(function ({name}) {
        switch (name) {
            case launchText:
                shell.exec('yarn; yarn start')
                break;
            case componentText:
                inquirer
                .prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'component name',
                }])
                .then(input => createComponent(input.name))
                break;
            case pageText:
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
            case apiText:
                inquirer
                .prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'api name (ex. "posts", "messages", "users")?',
                }])
                .then(({name}) => createApi(name))
                break;
            default:
                break;
        }
    });
});

function createApi(name) {
    const upperCase = upperCaseFirst(name)
    const lowerCase = lowerCaseFirst(name)
    /**
     * 1) create model
     * 2) create migration for model
     * 3) create controller
     * 4) create API middleware
     * 5) create test for middleware
     * 6) add line to server.js
     */
    shell.exec(`sequelize model:create --name ${name} --attributes 'name:string'`)
    copyFolderAndReplace(
        path.resolve(__dirname, '../templates/controller'),
        'controllerName',
        upperCase + 'Controller',
        path.resolve(__dirname, '../../src/server/data/controllers')
    )
    copyFolderAndReplace(
        path.resolve(__dirname, '../templates/apiMiddleware'),
        'apiName',
        lowerCase + 'Api',
        path.resolve(__dirname, '../../src/server/middlewares')
    )
    addLineToFile(
        path.resolve(__dirname, '../../src/server/server.js'),
        hook,
        `app.use(${'/api/' + lowerCase}, require(${'./middlewares/' + lowerCase + 'Api'}),`
    )
    console.log('don\'t forget to edit all the files!')
}

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

function addLineToFile(filePath, regex, replaceText) {
    replace({
        regex,
        silent: true,
        paths: [filePath],
        // replace 'regex' text with appropriate text, and add regex text again afterwards,
        // in order to this function reusable
        replacement: replaceText + ` \n${regex}`,
    })
}

function createPage(pageName, routePath) {
    const folderName = pageName
    const folderPath = path.resolve(__dirname, '../../src/browser/pages')
    const templatesPath = path.resolve(__dirname, '../templates/page')
    // add route to 'routes.js'
    // TODO use 'addLineToFile' function
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
    const folderPath = path.resolve(__dirname, '../../src/browser/components')
    copyFolderAndReplace(templatesPath, 'ComponentName', componentName, folderPath)
    // import component styles to main styles.scss file
    addLineToFile(
        path.resolve(__dirname, '../../src/browser/styles.scss'),
        hook,
       `@import "./components/${componentName}/${componentName}.scss";`
    )
}