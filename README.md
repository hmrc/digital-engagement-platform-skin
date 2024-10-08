
# digital-engagement-platform-skin

This is a front-end service for supplying chat skin to MDTP microservices.

## Setup

This application uses `node 18.12.1`. Follow these steps to set up node locally:

First of all, we need `nvm` (node version manager, so that we can run `node 18.12.1`)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
```

With `nvm` installed, we can set our node version to 18.12.1

```
nvm install 18.12.1
```

```
nvm use 18.12.1
```

## Unit Tests

This application has a considerable amount of JavaScript code, therefore, we have created a set of JS tests to cover the behaviour the system intends.

We use the JS testing framework `jest`. To install `jest` locally:

```
npm install --global jest
```

We now can run our JS tests with:
```
jest
```

To obtain code coverage for a single file:
```
jest --findRelatedTests app/assets/javascripts/controllers/CommonChatController.js --coverage
```

For whole service coverage and coverage report of each file:
```
jest --coverage
``` 

## JavaScript Build Tool: Webpack

Webpack is used to bundle the various JS files in to one file: `app/assets/javascripts/bundle/hmrcChatSkin.ts`

To create the bundle manually you must install `webpack` and `webpack-cli` globally:
```
npm install --global webpack
```

```
npm install --global webpack-cli
```

Then run: 

```
webpack build
```

However, starting the service will bundle the JS code automatically.


## Scala & JavaScript Build

### Development mode

When developing using the command `sbt run`, the project is set up to run the `start` script in the `package.json` file.

It does this by using a `PlayRunHook` defined in `project/WebpackRunHook.scala`, which calls the `start` script. 

This script installs JS dependencies, bundles & minimises the JS code, and recompiles the bundle after changes to JS files: 

`npm install && webpack --config webpack.config.js --mode=development --watch --optimization-minimize`


### Build & Deployment

When deployed, the JS bundle is created during the SBT Test stage, using an SBT Setting. 

This is because including the setting in the SBT Compile stage caused the bundle to be created multiple times on a developer's machine (At times it took 5 minutes to start the service locally).

Artefacts generated during the Test stage are included in the final build. 

## Useful commands

To manually remove node modules:
```
rm -rf node_modules
```

To reinstall:
```
npn install
```

## Troubleshooting

`Error: Cannot find module 'fs/promises'` 

This is caused by not using `node 18.12.1`, run the command `nvm install 18.12.1`

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").

