const path = require('path');

module.exports = {
  entry: './hmrcChatSkin.ts',
  context: path.resolve(__dirname, 'app/assets/javascripts'),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                  targets: { "node": "current", browsers: ["ie >= 10"] }
                },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  output: {
    filename: 'hmrcChatSkin.js',
    path: path.resolve(__dirname, './app/assets/javascripts/bundle'),
  },
};

