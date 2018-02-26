const lib = require('./lib');
const path = require('path');

module.exports = config => {
  config.set({
    plugins: ['karma-jasmine', 'karma-mocha-reporter', 'karma-phantomjs-launcher', lib],
    frameworks: ['jasmine'],
    reporters: ['mocha'],
    browsers: ['PhantomJS'],
    logLevel: config.LOG_INFO,
    // disable > error > warn > info > debug
    captureTimeout: 60000,
    autoWatch: true,
    singleRun: false,
    colors: true,
    port: 9876,
    basePath: '',
    files: [{ pattern: 'test/t1.spec.js', watched: false }],
    exclude: [],

    preprocessors: {
      'test/*.spec.js': ['fusebox']
    },

    fusebox: {
      writeBundles: false,
      homeDir: path.join(process.cwd(), 'test/'),
      target: 'browser@es5',
      log: true,
      debug: true,
      sourceMap: true,
      cache: false
    }
  });
};
