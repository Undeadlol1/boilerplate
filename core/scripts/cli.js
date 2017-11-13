const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const shell = require('shelljs')
const replace = require('replace')
const inquirer = require('inquirer')
const pluralize = require('pluralize')
const upperCase = require('change-case').upperCase
const lowerCase = require('change-case').lowerCase
const upperCaseFirst = require('change-case').upperCaseFirst
const lowerCaseFirst = require('change-case').lowerCaseFirst

// cli options
const   createText      = 'create new project',
        launchText      = 'launch project',
        updateText      = 'update project',
        apiText         = 'create API',
        pageText        = 'create page',
        componentText   = 'create component',
        reduxText       = 'create redux module'

const   hook = "// ⚠️ Hook for cli! Do not remove 💀",
        imagePath = path.resolve(__dirname, '../ascii.txt')

fse
// read ascii image
.readFile(imagePath, "utf8")
// show image and cli options
.then(ascii => {
    console.log(ascii);
    return inquirer.prompt([{
        type: 'list',
        name: 'name',
        choices: [launchText, componentText, pageText, updateText, apiText, reduxText], // createText,
        message: 'What do you want to do?',
    }])
})
// show prompt depending on users decision
.then(({name}) => {
    switch (name) {
        case createText:
            console.log('creating of project must be here')
            return  inquirer
                    .prompt([{
                        name: 'name',
                        type: 'input',
                        message: 'project name',
                    }])
                    .then(({name}) => createProject(name))
        case launchText:
            return shell.exec('yarn; yarn start')
        case componentText:
            return  inquirer
                    .prompt([{
                        name: 'name',
                        type: 'input',
                        message: 'component name',
                    }])
                    .then(input => createComponent(input.name))
        case pageText:
            return  inquirer
                    .prompt([{
                        name: 'name',
                        type: 'input',
                        message: 'page file name (ex: IndexPage, UserPage)?',
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
        case reduxText:
            return  inquirer
                    .prompt([{
                        name: 'name',
                        type: 'input',
                        message: 'module name (ex: post, message, user)?',
                    }])
                    .then(({name}) => createReeduxModule(name))
        case updateText:
            shell.exec('git remote add upstream https://github.com/developer-expirience/boilerplate')
            shell.exec('git pull upstream master --allow-unrelated-histories')
            shell.exec('yarn')
            shell.echo('😎  all done 😎')
            break;
        case apiText:
            return  inquirer
                    .prompt([{
                        name: 'name',
                        type: 'input',
                        message: 'api name (ex. "posts", "messages", "users")?',
                    }])
                    .then(({name}) => createApi(name))
        default:
            break;
    }
})
.catch(err => console.error(err))

// TODO this is WIP
function createProject(name) {
    // TODO change path in future
    shell.exec('git clone https://github.com/developer-expirience/boilerplate ' + name)

    shell.exec('cd ' + name + ';') // yarn
    // git remote remove origin
    // git remote add upstream https://github.com/developer-expirience/boilerplate
    replace({
        regex: require('../../development.json').APP_NAME,
        silent: true,
        paths: [path.resolve(__dirname, '../../development.json')], // TODO or change every file?
        replacement: name,
    })
    // yarn
    // change DB config
    // run sequelize migration (development and testing)
    // start project
}

function createReeduxModule(name) {

    const firtUpperCase = upperCaseFirst(name)
    const upperCaseName = upperCase(name)

    const firstHook = "// ⚠️ First hook for cli! Do not remove 💀"
    const secondHook = "// ⚠️ Second hook for cli! Do not remove 💀"
    const thirdHook = "// ⚠️ Third hook for cli! Do not remove 💀"
    const rootReducer = path.resolve(__dirname, '../../src/browser/redux/reducers/RootReducer.js')

    copyFolderAndReplace(
        path.resolve(__dirname, '../templates/redux'),
        'moduleName',
        name,
        path.resolve(__dirname, '../../src/browser/redux/'),
        true
    )

    addLineToFile(
        rootReducer,
        firstHook,
        `import ${name}, { initialState as ${name}State } from 'browser/redux/${name}/${name}Reducer'`
        + '\n'
        + firstHook
    )
    addLineToFile(
        rootReducer,
        secondHook,
        `${name}: ${name}State,`
        + '\n'
        + secondHook
    )
    addLineToFile(
        rootReducer,
        thirdHook,
        `${name},`
        + '\n'
        + thirdHook
    )
}

/**
 * create API files
 * @param {string} name
 */
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
        path.resolve(__dirname, '../templates/apiMiddleware'),
        'apiName',
        lowerCase,
        path.resolve(__dirname, '../../src/server/middlewares'),
        false,
        lowerCase + 'Api'
    )
    addLineToFile(
        path.resolve(__dirname, '../../src/server/server.js'),
        hook,
        `app.use('/api/${lowerCase}', require('./middlewares/${lowerCase}Api').default)`
    )
    /*
        controller files should be created when
        linking functions to model is implemented properly
    */
    // copyFolderAndReplace(
    //     path.resolve(__dirname, '../templates/controller'),
    //     'controllerName',
    //     upperCase + 'Controller',
    //     path.resolve(__dirname, '../../src/server/data/controllers')
    // )
    console.log('don\'t forget to edit all the files!')
}

/**
 * Copy files from folder and replace parts of text and file name
 * @param {string} folderPath what to copy
 * @param {string} replaceWhat what to replace
 * @param {string} replaceText replacement text
 * @param {string} outputPath where to put folder
 * @param {boolean} uppercaseFileName should first letter of file name be uppercased
 * @param {string} specifiFileName specify otput file name if needed
 */
function copyFolderAndReplace(folderPath, replaceWhat, replaceText, outputPath, uppercaseFileName, specifiFileName) {
    return fse
        // 1) create folder
        .mkdir(`${outputPath}/${specifiFileName || replaceText}`)
        // 2) copy files from folderPath
        .then(() => fse.readdir(folderPath))
        .then(files => {
            return files.forEach(file => {
                // 3) replace text in each file and rename it
                return fse.readFile(folderPath + '/' + file, 'utf8')
                    .then(data => {
                        let fileText = data
                        const regex = new RegExp(replaceWhat, "g")
                        // replace different variations of string
                        const cases = [
                            {
                                from: replaceWhat,
                                to: replaceText,
                            },
                            // plurals and singulars
                            {
                                from: 'plural',
                                to: pluralize.plural(replaceText),
                            },
                            {
                                from: 'singular',
                                to: pluralize.singular(replaceText),
                            },
                            {
                                from: 'Singular',
                                to: upperCaseFirst(pluralize.singular(replaceText)),
                            },
                            {
                                from: 'Plural',
                                to: upperCaseFirst(pluralize.plural(replaceText)),
                            },
                            // cases
                            {
                                from: lowerCase(replaceWhat),
                                to: lowerCase(replaceText),
                            },
                            {
                                from: upperCase(replaceWhat),
                                to: upperCase(replaceText),
                            },
                            {
                                from: upperCaseFirst(replaceWhat),
                                to: upperCaseFirst(replaceText),
                            },
                            {
                                from: lowerCaseFirst(replaceWhat),
                                to: lowerCaseFirst(replaceText),
                            },
                        ]
                        cases.forEach(({from, to}) => {
                            return fileText = fileText.replace(new RegExp(from, "g"), to)
                        })

                        let fileName = file.replace(regex, specifiFileName || replaceText)

                        if (uppercaseFileName) fileName = upperCaseFirst(fileName)

                        return fse.writeFile(`${outputPath}/${specifiFileName || replaceText}/${fileName}`, fileText, 'utf8')
                    });
            })
        })
        .catch(err => console.error(err))
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
        replacement: `{ path: '${routePath}', component: require('browser/pages/${pageName}').default },\n${hook}`,
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