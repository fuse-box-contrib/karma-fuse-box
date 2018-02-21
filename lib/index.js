'use strict';

const path = require('path');
const FuseBox = require('fuse-box').FuseBox;
const chokidar = require('chokidar');
const _ = require('lodash');

function createPreprocessor(options, preconfig, basePath, emitter, logger) {
  const log = logger.create('preprocessor.fusebox');

  return (content, file, done) => {
    console.log('Options: ', options);
    console.log('Preconfig: ', preconfig.options);
    console.log('Input: ', file.path);
    const config = { ...options, ...preconfig.options, input: file.path };
    const fuse = FuseBox.init(config);
    const bundler = fuse.bundle('app').instructions('**/*.ts');
    bundler
      .run()
      .then(bundle => {
        console.log(bundle);
        const sourcemap = (config.output && config.output.sourcemap) || config.sourcemap;
        let output = bundle.code;
        if (sourcemap === 'inline') {
          output += `\n//# sourceMappingURL=${bundle.map.toUrl()}\n`;
        }
        done(null, output);
      })
      .catch(error => {
        const location = path.relative(basePath, file.path);
        log.error('Error processing “%s”\n\n%s\n', location, error.stack || error.message);
        done(error, null);
      });
  };
}

createPreprocessor.$inject = ['config.fusebox', 'args', 'config.basePath', 'emitter', 'logger'];

module.exports = { 'preprocessor:fusebox': ['factory', createPreprocessor] };
