'use strict';
/**
 * Webpack frontend test (w/ coverage) configuration.
 */
var merge = require('lodash.merge');
var testCfg = require('./webpack.config.test');

module.exports = merge({}, testCfg, {
  module: {
    preLoaders: [
      // Manually instrument client code for code coverage.
      // https://github.com/deepsweet/isparta-loader handles ES6 + normal JS.
      {
        test: /src\/.*\.jsx?$/,
        exclude: /(test|node_modules)\//,
        loader: require.resolve('isparta-loader')
      }
    ]
  }
});
