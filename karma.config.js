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
    singleRun: true,
    colors: true,
    port: 9876,
    basePath: '',
    files: [
      { pattern: 'test/t1.spec.js', watched: false },
      { pattern: 'test/t2.spec.js', watched: false }
    ],
    exclude: [],

    preprocessors: {
      'test/*.spec.js': ['fusebox']
    },

    fusebox: {
      homeDir: path.join(process.cwd(), 'test/')
    }
  });
};
