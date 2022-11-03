
# digital-engagement-platform-skin

This is a front-end service for supplying chat skin to MDTP microservices.

This application uses `node 12`. Follow these steps if you don't know how to set your local version of node to `12`:

First of all, we need `nvm` (node version manager, so that we can run `node 12`)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
```

With `nvm` installed, we can set our node version to 12

```
nvm install 12
```

```
nvm use 12
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

To obtain code coverage run...

For a single file:
```
jest --findRelatedTests app/assets/javascripts/controllers/CommonChatController.js --coverage
```

For whole service coverage and coverage report of each file:
```
jest --coverage
``` 

## JavaScript Build Tool: Webpack

Webpack is used to bundle the various JS files in to one file: `app/assets/javascripts/bundle/hmrcChatSkin.js`

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

However, starting the service will do this automatically.


## Scala & JavaScript Build

### Development mode

When developing using the command `sbt run`, the project is set up to run the `start` script in the `package.json` file.

It does this by using a `PlayRunHook` defined in `project/WebpackRunHook.scala`, which calls the `start` script. 

This script installs JS dependencies, bundles the JS code, and recompiles the bundle after changes to JS files: 

`npm install && webpack --config webpack.config.js --mode=development --watch`


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


### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
