'use strict';
const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const _ = require('lodash');
const TerserPlugin = require('terser-webpack-plugin-legacy');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}
const cssFilename = 'static/css/[name].[contenthash:8].css';
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

let config = {
  bail: true,
  devtool: false,
  entry: [require.resolve('./polyfills'), paths.appIndexJs],
  output: {
    path: path.resolve(process.cwd(), '../server/client_build/'),
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
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
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: {
                    loader: require.resolve('style-loader'),
                    options: {
                      hmr: false,
                    },
                  },
                  use: [
                    {
                      loader: require.resolve('css-loader'),
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: false,
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
                extractTextPluginOptions
              )
            ),
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [
              /\.(js|jsx|mjs|ts|tsx)$/,
              /\.html$/,
              /\.json$/,
              /\.(less|config|variables|overrides)$/,
            ],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new InterpolateHtmlPlugin(env.raw),
    new webpack.DefinePlugin(env.stringified),
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
let configs = [config];
let fs = require('fs');
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
    remoteModuleConfig.plugins.splice(3, 1);
    if (directory !== 'h265Worker') {
      remoteModuleConfig.plugins.push(
        new TerserPlugin({
          terserOptions: {
            compress: false,

          }
        })
      )
      // remoteModuleConfig.plugins.push(
      //   new webpack.optimize.UglifyJsPlugin({
      //     compress: false, //для того чтоб можно было экспортировать как модули
      //     mangle: {
      //       safari10: true,
      //     },
      //     output: {
      //       comments: false,
      //       ascii_only: true,
      //     },
      //     beautify: false,
      //     sourceMap: false,
      //     ie8: false,
      //     passes: 1,
      //   })
      // );
    }
    configs.push(remoteModuleConfig);
  });
}
config.plugins.push(
  new TerserPlugin()
)
// config.plugins.push(
//   new webpack.optimize.UglifyJsPlugin({
//     parallel: true,
//     compress: {
//       warnings: false,
//       comparisons: true,
//       negate_iife: false,
//     },
//     mangle: {
//       safari10: true,
//     },
//     output: {
//       comments: false,
//       ascii_only: false,
//     },
//     beautify: false,
//     sourceMap: false,
//     ie8: false,
//     passes: 1,
//   })
// );

module.exports = configs;
