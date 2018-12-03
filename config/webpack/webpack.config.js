'use strict';

var path = require('path');
var webpack = require('webpack');

// Replace with `__dirname` if using in project root.
var ROOT = process.cwd();

// **Little Hacky**: Infer the filename and library name from the package name.
//
// Assumptions:
// - `package.json`'s `name` field is name of dist files.
// - PascalCased version of that name is exported class name.
var PKG = require(path.join(ROOT, 'package.json'));
var libPath = (PKG.name || '').toLowerCase();
if (!libPath) { throw new Error('Need package.json:name field'); }
// PascalCase (with first character capitalized).
var libName = libPath
  .replace(/^\s+|\s+$/g, '')
  .replace(/(^|[-_ ])+(.)/g, function(match, first, second) {
    // Second match group is the character we want to change. Throw away first.
    return second.toUpperCase();
  });

module.exports = {
  cache: true,
  entry: path.join(ROOT, 'src/index.js'),
  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],
  output: {
    path: path.join(ROOT, 'dist'),
    filename: libPath + '.min.js',
    library: libName,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [__dirname, 'node_modules'],
    unsafeCache: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        // **Note**: Cannot use shorthand `'babel-loader'` or `'babel'` when
        // we are playing around with `NODE_PATH` in builder. Manually
        // resolve path.
        loader: require.resolve('babel-loader'),
        query: {
          babelrc: false,
          presets: ['es2015', 'stage-2', 'react'],
          plugins: [
            'syntax-class-properties',
            'syntax-decorators',
            'transform-class-properties',
            'transform-decorators-legacy',
            'transform-runtime'
          ]
        }
      }, {
        test: /\.css$/,
        loader: require.resolve('style-loader') + '!' + require.resolve('css-loader')
      }, {
        test: /\.(png|jpg)$/,
        loader: require.resolve('url-loader') + '?limit=8192'
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      // Signal production, so that webpack removes non-production code that
      // is in condtionals like: `if (process.env.NODE_ENV === 'production')`
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.SourceMapDevToolPlugin({filename: '[file].map'})
  ]
};
