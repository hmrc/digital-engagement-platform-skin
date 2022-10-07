const path = require('path');

  module.exports = {
   entry: './hmrcChatSkin.js',
   context: path.resolve(__dirname, 'app/assets/javascripts'),
   devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    },
    output: {
      filename: 'hmrcChatSkin.js',
      path: path.resolve(__dirname, './app/assets/javascripts/bundle'),
    },
  };

  // to support hot reloading in development mode, files are written to sbt-web folder.
  // for a production build, files are written to a folder which is configured
  // to be bundled into the public assets folder.
  function getOutputPath(mode) {
    const dir = (mode === 'production') ? 'target/webpack/js' : 'target/web/public/main/js';
    return path.resolve(__dirname, dir);
  }