'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const FuseBox = require('fuse-box').FuseBox;

let blocked = [];
let isBlocked = false;

const escapeRegExp = str => {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
};

function Plugin(
  /* config.fusebox */ fuseboxOptions,
  /* config.basePath */ basePath,
  /* config.files */ files,
  /* config.frameworks */ frameworks,
  /* config.singleRun */ singleRun,
  customFileHandlers,
  emitter
) {
  const fuseConfig = {
    homeDir: fuseboxOptions.homeDir,
    output: path.join(os.tmpdir(), '_karma_fusebox_'),
    target: 'browser@es5',
    cache: false,
    log: false,
    info: false
  };
  const fuse = FuseBox.init(fuseConfig);
  const bundleName =
    files.length > 0 ? path.basename(files[0].pattern).slice(0, -3) : 'karma-fusebox';
  fuse
    .bundle(bundleName)
    .instructions(`+ ${files.map(file => path.relative(fuseConfig.homeDir, file.pattern)).join(' +')}`);

  this.files = [];
  this.basePath = basePath;
  this.emitter = emitter;
  this.done = fuse.run().catch(e => {
    console.error(e.stack || e);
    if (e.details) {
      console.error(e.details);
    }
    throw e;
  });
  let middleware;
  fuse.dev({ root: fuseConfig.output }, server => {
    const app = server.httpServer.app;
    middleware = (req, res, next) => {
      console.log('Middleware', req);
      next();
    };
  });

  // customFileHandlers.push({
  //   urlRegex: new RegExp(`^${escapeRegExp(fuseConfig.output)}.*`),
  //   handler: (req, res) => {
  //     middleware(req, res, () => {
  //       res.statusCode = 404;
  //       res.end('Not found');
  //     });
  //   }
  // });
}

Plugin.prototype.readFile = function readFile(file, callback) {
  this.done.then(() => {
    const contents = fs.readFileSync(path.join(os.tmpdir(), '_karma_fusebox_', file.replace(/\\/g, '/')));
    callback(undefined, contents);
  });
};

function createPreprocessor(/* config.basePath */ basePath, fuseboxPlugin, logger) {
  const log = logger.create('preprocessor.fusebox');
  return (content, file, done) => {
    log.debug('Processing file:', file.path);
    fuseboxPlugin.readFile(path.relative(basePath, file.originalPath), (err, result) => {
      if (err) {
        throw err;
      }

      done(err, result && result.toString());
    });
  };
}

function createMiddleware(logger) {
  const log = logger.create('middleware.fusebox');
  return (request, response, next) => {
    if (isBlocked) {
      blocked.push(next);
    } else {
      next();
    }
  };
}

module.exports = {
  fuseboxPlugin: ['type', Plugin],
  'preprocessor:fusebox': ['factory', createPreprocessor],
  'middleware:fusebox': ['factory', createMiddleware]
};
