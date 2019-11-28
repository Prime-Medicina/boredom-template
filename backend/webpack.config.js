const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: 'development',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.js'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  target: 'node',
};
