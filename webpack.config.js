const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const srcPath = path.resolve(__dirname, 'src/');
const distPath = path.resolve(__dirname, 'dist/');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

module.exports = {
  resolve: {
    modules: [
      srcPath,
      'node_modules',
    ],
  },
  entry: {
    select: 'common.js',
    'select.min': 'common.js',
  },
  output: {
    path: distPath,
    filename: '[name].js',
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: [/node_modules/],
      //   enforce: 'pre',
      //   use: [{
      //     loader: 'eslint-loader',
      //   }],
      // },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ng-annotate-loader',
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        }],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.BannerPlugin({
      banner: [
        `${pkg.name}`,
        `${pkg.homepage}`,
        `Version: ${pkg.version} - ${new Date().toISOString()}`,
        `License: ${pkg.license}`,
      ].join('\n'),
    }),
    new ExtractTextPlugin('[name].css'),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/,
      // cssProcessor: require('cssnano'),
      // cssProcessorOptions: { discardComments: {removeAll: true } },
      // canPrint: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      preserveComments: 'some',
      sourceMap: true,
    }),
  ],
};
