const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  rules: {
    test: /\.pug$/,
    loader: 'pug-plain-loader',
  },
  plugins: [
    new CircularDependencyPlugin({
      failOnError: false,
      allowAsyncCycles: true,
    }),
  ],
};
