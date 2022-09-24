# Northcoders News API

## Hosted Version Link

https://sf-backend-project.herokuapp.com/api

## Project Summary

The purpose of this project was to build an API for the purpose of accessing application data programmatically. The idea was to mimic the building of a real world backend service which should provide this information to the front end architecture.

The database is made using PSQL and is interacted with using node-postgres.

If you wish to 'clone' this repo from Github you will need to install the following dependencies and seed the database.

## Install Dependencies

By default, 'npm install' will install all modules listed as dependencies in package.json. In this case this will install:

"cors": "^2.8.5",<br>
"dotenv": "^16.0.1",<br>
"express": "^4.18.1",<br>
"fs.promises": "^0.1.2",<br>
"pg": "^8.7.3",<br>
"pg-format": "^1.0.4"

If you would like to run the tests contained in the test folder you will also need to install the following as devDependencies (npm install -D "jest" for example):

"husky": "^7.0.4",<br>
"jest": "^27.5.1",<br>
"jest-extended": "^2.0.0",<br>
"jest-sorted": "^1.0.14",<br>
"supertest": "^6.2.4"

"husky" is optional and is only relevant if you are wishing to run your tests before committing to gitHub, each time you attempt a commit.

## Seed Database

There are premade scripts specified in the package.json file for this, simply run these two commands:

npm run setup-dbs
npm run seed

## .env

Along with the node_modules the .env files have also been ignored and therefore if you clone this repo you will need to set these up yourself.
Create two files:
".env.development"
".env.test"
The development file should contain the text "PGDATABASE=nc_news" to connect to the main development database.
The test file should contain the text "PGDATABASE=nc_news_test" to connect to the test database.
add to your .gitignore file along with your node_modules:
".env.\*"

## Version Requirements

In order to run this project the minimimum version requirements are as follows:

Node.js: "18.6.0"
Postgres: "14.4"
