'use strict';

const os = require('os');
const path = require('path');
const FuseBox = require('fuse-box').FuseBox;

function createPreprocessor(options, preconfig, basePath, emitter, logger) {
  const log = logger.create('preprocessor.fusebox');

  return (content, file, done) => {
    const config = {
      ...options,
      ...preconfig.options,
      input: file.path,
      output: path.join(os.tmpdir(), '_karma_fusebox_'),
      sourceMaps: true
    };
    const fuse = FuseBox.init(config);
    const bundleName = path.basename(file.originalPath).slice(0, -3);
    fuse.bundle(bundleName).instructions('+ ' + path.relative(config.homeDir, file.originalPath));
    fuse
      .run()
      .then(producer => {
        let result;
        producer.bundles.forEach(bundle => {
          result = bundle.context.output.lastPrimaryOutput;
        });
        let output = result.content;
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
