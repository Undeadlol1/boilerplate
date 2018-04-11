This is a fullstack javascript boilerplate based on React, Express and Sequelize.

## Features

* Predefined user system with signup/login flows. Also supports 3d party providers like Twitter or Facebook.
* Command Line Interface with various usefull commands like pulling updates from boilerplate, creating Components and Api's.
* TDD/BDD is available. Project has ~250 tests.
* Simple forum functionality is implemented.
* Robust i18n.
* Docker image.
* Comment system is provided with 3d party solutions like Facebook comments or Disqus.
* Lots of things work out of the box. Projects includes development/production scripts, webpack configurations, fully working front-end and back-end stacks.
* Sequelize is used as DB ORM. This means Mysql/PostgreSQL is supported. Simply change "dialect" option in configuration file.
* Common libraries are used for ease of adoptation: react, react-router, redux, redux-thunk, Sequelize, expressjs and so on.

## Installation

Run:

`npm run set_up`

Although npm will work, you better also install yarn. It's is preffered dependency manager.


## How to update
1) run `yarn cli`
2) select 'update project' menu item