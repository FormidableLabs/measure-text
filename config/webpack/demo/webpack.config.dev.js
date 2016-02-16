var webpack = require('webpack');

module.exports = {
  devServer: {
    contentBase: './demo',
    noInfo: false
  },

  output: {
    path: './demo',
    filename: 'main.js',
    publicPath: '/assets/'
  },

  cache: true,
  devtool: 'source-map',
  entry: {
    app: ['./demo/app.jsx']
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        // **Note**: Cannot use shorthand `'babel-loader'` or `'babel'` when
        // we are playing around with `NODE_PATH` in builder. Manually
        // resolve path.
        loader: require.resolve('babel-loader')
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
    new webpack.NoErrorsPlugin()
  ]
};
