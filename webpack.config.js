const path = require('path');

module.exports = {
  entry: './hmrcChatSkin.js',
  context: path.resolve(__dirname, 'app/assets/javascripts'),
  devtool: 'inline-source-map',
  module: {
    rules: [
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
                  targets: { "node": "current", "ie": "10" }
                },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  output: {
    filename: 'hmrcChatSkin.js',
    path: path.resolve(__dirname, './app/assets/javascripts/bundle'),
  },
};

