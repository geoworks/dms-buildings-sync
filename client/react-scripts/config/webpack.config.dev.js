'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const _ = require('lodash');
const fs = require('fs');
const publicUrl = '';
const env = getClientEnvironment(publicUrl);
let modifyVars = {
  '@primary-color':
    process.env && process.env.project_name === 'mapcam' ? '#17f' : '#2a0', //#4ace55
  '@body-background': '#fff',
  '@component-background': 'rgb(255, 255, 255)',
  '@text-color': 'fade(#000000, 100%)',
  '@text-color-secondary': 'fade(#000, 80%)',
  '@shadow-color': 'fade(@primary-color, 30%)',
  '@layout-body-background': '#ffffff',
  '@zindex-tooltip': '10060',
  '@animation-duration-fast': '.1s',
  '@layout-header-padding': '0 14px',
};

let config = {
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('./polyfills'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', '.tsx', '.ts'],
    alias: {
      deql: path.resolve(process.cwd(), './deql-ms-client/src/'),
      '@': path.resolve(process.cwd(), './src'),
    },
    plugins: [
      new ModuleScopePlugin(path.resolve(process.cwd(), './'), [
        paths.appPackageJson,
      ]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: require.resolve('ts-loader'),
      },
      {
        test: /\.less$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true,
              modifyVars,
            },
          },
        ],
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
          {
            exclude: [
              /\.(js|jsx|mjs|ts|tsx)$/,
              /\.html$/,
              /\.json$/,
              /\.(less|config|variables|overrides)$/,
            ],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleScopePlugin(path.resolve(process.cwd(), './')),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
};

let configs = [config];
if (fs.readdirSync('./src/').indexOf('remoteModules') > -1) {
  fs.readdirSync('./src/remoteModules').forEach(directory => {
    let remoteModuleConfig = _.cloneDeep(config);
    remoteModuleConfig.entry = [
      path.resolve(
        process.cwd(),
        './src/remoteModules/' + directory + '/index.tsx'
      ),
    ];
    remoteModuleConfig.output.filename =
      'static/modules/' + directory + '/index.js';
    remoteModuleConfig.output.chunkFilename =
      'static/modules/' + directory + '/index.chunk.js';
    remoteModuleConfig.plugins.splice(0, 1);
    remoteModuleConfig.plugins.splice(0, 1);
    configs.push(remoteModuleConfig);
  });
}

module.exports = configs;
