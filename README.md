# boredom-template

A 100% JavaScript serverles monorepo using lerna.

## Setup
```bash
$ npm install lerna -g
$ lerna bootstrap
```

## First deploy
```bash
$ npm run deploy:init
```

## Deploy options
#### Full
```bash
$ npm run deploy
```
#### Resources only
```bash
$ npm run deploy:resources
```
#### API only
```bash
$ npm run deploy:api
```
#### Use lerna to deploy more specific scopes
* lerna users package.json names property to filter the scope
* user --no-bail to prevent process from exiting before all the jobs are finished
```bash
$ lerna exec --no-bail --scope sls-my-specific-scope-* sls deploy
```

## TODO
- [ ] Create RequestMap API
- [ ] Create authorizer for ensuring RequestMap rules
