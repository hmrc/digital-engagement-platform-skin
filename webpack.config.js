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