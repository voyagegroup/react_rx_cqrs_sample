'use strict';

const isRelease = process.env.NODE_ENV === 'production';

module.exports = {
  context: __dirname + "/__obj",
  entry: "./index.js",
  output: {
    path: __dirname + '/__dist',
    filename: 'bundle.js'
  },
  resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  devtool: isRelease ? '' : 'source-map',
};
