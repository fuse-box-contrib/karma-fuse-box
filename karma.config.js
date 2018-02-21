const lib = require('./lib');

module.exports = config => {
  config.set({
    plugins: ['karma-jasmine', 'karma-mocha-reporter', 'karma-phantomjs-launcher', lib],
    frameworks: ['jasmine'],
    reporters: ['mocha'],
    browsers: ['PhantomJS'],
    logLevel: config.LOG_INFO, // disable > error > warn > info > debug
    captureTimeout: 60000,
    autoWatch: true,
    singleRun: true,
    colors: true,
    port: 9876,
    basePath: '',
    files: [{ pattern: 'test/t1.js', watched: false }],
    exclude: [],

    preprocessors: {
      'test/t1.js': ['fusebox']
    },
    fusebox: {
      homeDir: 'lib/',
      output: 'dist/$name.js',
      target: 'browser@es5',
      log: true,
      debug: true
    }
  });
};
