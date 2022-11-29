// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('./config/env');

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('./config/webpack.config.prod');
const paths = require('./config/paths');
let zlib = require('zlib');

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.

fs.emptyDirSync(paths.appBuild);
fs.copySync(paths.appPublic, paths.appBuild, {
  dereference: true,
  filter: file => file !== paths.appHtml,
});

build().then(
  ({ stats, previousFileSizes, warnings }) => {
    if (warnings.length) {
      console.log('Compiled with warnings.\n');
      console.log(warnings.join('\n\n'));
      console.log(
        '\nSearch for the ' +
        'keywords' +
        ' to learn more about each warning.'
      );
      console.log(
        'To ignore, add ' +
        '// eslint-disable-next-line' +
        ' to the line before.\n'
      );
    } else {
      console.log('Compiled successfully.\n');
    }
    console.log('compress static files');
    afterCompress();
  },
  err => {
    console.log('Failed to compile.\n');
    console.error(err);
    process.exit(1);
  }
);

let Folders = ['js', 'css'];
let constPath = '../../server/client_build/';
let afterCompress = () => {
  //чтение файлов
  if (
    fs.existsSync(path.resolve(process.cwd(), constPath + '')) &&
    fs.existsSync(path.resolve(process.cwd(), constPath + 'static'))
  ) {
    let remoteModules = fs.existsSync(
      path.resolve(process.cwd(), constPath + 'static/' + 'modules')
    );
    if (remoteModules) {
      let modules = fs.readdirSync(
        path.resolve(process.cwd(), constPath + 'static/' + 'modules' + '/'),
        'utf-8'
      );
      if (modules && Array.isArray(modules)) {
        Folders = Folders.concat(modules.map(m => 'modules/' + m));
      }
    }

    Folders.forEach(folder => {
      if (
        fs.existsSync(
          path.resolve(process.cwd(), constPath + 'static/' + folder)
        )
      ) {
        fs.readdirSync(
          path.resolve(process.cwd(), constPath + 'static/' + folder)
        ).forEach(fileName => {
          if (fileName.split('.').length > 1 && fileName.split('.').slice(-1)[0] !== 'br') {
            let file = fs.readFileSync(
              path.resolve(
                process.cwd(),
                constPath + 'static/' + folder + '/' + fileName
              ),
              'utf-8'
            );
            fs.writeFileSync(
              path.resolve(
                process.cwd(),
                constPath + 'static/' + folder + '/' + fileName + '.br'
              ),
              zlib.brotliCompressSync(file, {
                params: {
                  [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                  [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
                  [zlib.constants.BROTLI_PARAM_SIZE_HINT]: file.length,
                },
              })
            );
            fs.unlinkSync(
              path.resolve(
                process.cwd(),
                constPath + 'static/' + folder + '/' + fileName
              )
            );
          }
        });
      } else {
        console.error(
          'Не найдена папка ',
          constPath + 'static/' + folder,
          'поиск в ',
          path.resolve(process.cwd(), constPath + 'static/')
        );
      }
    });
  }
};
// Create the production build and print the deployment instructions.
function build() {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = stats.toJson({}, true);
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          '\nTreating warnings as errors because process.env.CI = true.\n' +
          'Most CI servers set it automatically.\n'
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes: 0,
        warnings: messages.warnings,
      });
    });
  });
}
