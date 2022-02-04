
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

## Unit tests

To run the unit tests execute

```
sbt test
```

This application has a considerable amount of javascript code, therefore, we have created a set of javascript tests to cover the behaviour the system intends. We use `gulp.js` to pipeline all of our javascript tests into the sbt test pipeline, mentioned above. To be able to run javascript tests in isolation you will need `gulp.js` and also `jest` (the test runner currently used).

Let's install `gulp cli` then we can run gulp commands:

```
npm install --global gulp-cli
```

Now, all we have left is to install `jest` globally:

```
npm install --global jest
```

We now can run our `javascripts` tests with:
```
gulp jest
```
or, since you have `jest`globally
```
jest
```

## Custom gulp commands

To wipe all your node modules use the below command, after that - if you do `sbt-test` it will automatically run an `npm-install` (or you can do `npm-install` manually)

```
gulp clean:node_modules
```

Our javascript code is bundled at compile time, if you want to check what the bundled code will look like locally, please run:

```
gulp bundle
```

The bundled code will be created within `app/assets/javascripts/bundle/gtm_dl.js`

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
