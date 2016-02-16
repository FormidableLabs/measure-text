'use strict';

var cloneDeep = require('lodash.clonedeep');
var merge = require('lodash.merge');
var omit = require('lodash.omit');
var base = require('./webpack.config.dev');

// Clone our own module object.
var mod = cloneDeep(base.module);
var firstLoader = mod.loaders[0];

// Update loaders array. First loader needs react-hot-loader.
firstLoader.loaders = [require.resolve('react-hot-loader')]
  .concat(firstLoader.loader ? [firstLoader.loader] : [])
  .concat(firstLoader.loaders || []);

// Remove single loader if any.
firstLoader.loader = null;

module.exports = merge({}, omit(base, 'entry', 'module'), {
  entry: {
    app: [
      require.resolve('webpack/hot/dev-server'),
      './demo/app.jsx'
    ]
  },

  module: mod,
  plugins: []
});
