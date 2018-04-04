<div align="center">
  <a href='https://github.com/karma-runner/karma'>
    <img width="200" height="200" vspace="20" hspace="25"
      src="https://worldvectorlogo.com/logos/karma.svg">
  </a>
  <a href="https://github.com/fuse-box/fuse-box">
    <img width="200" height="200" vspace="40" hspace="25"
      src="logo.svg">
  </a>
  <h1>Karma-FuseBox</h1>
  <img src="https://img.shields.io/npm/dm/karma-fuse-box.svg?style=flat">
  <a href="https://www.npmjs.org/package/karma-fuse-box">
    <img src="https://badge.fury.io/js/karma-fuse-box.svg">
  </a>
  <a href="https://travis-ci.org/fuse-box-contrib/karma-fuse-box">
    <img src="https://img.shields.io/travis/fuse-box-contrib/karma-fuse-box/master.svg">
  </a>
  <a href="https://ci.appveyor.com/project/fuse-box-contrib/karma-fuse-box/branch/master">
    <img src="https://img.shields.io/appveyor/ci/fuse-box-contrib/karma-fuse-box/master.svg?label=Windows">
  </a>
  <p>Use FuseBox to preprocess files in Karma<p>
</div>

## Install

With `npm`

```shell
npm install --save-dev karma-fuse-box
```

With `yarn`

```shell
yarn add --dev karma-fuse-box
```

## Usage

**karma.conf.js**

```js
const path = require("path");

module.exports = config => {
  config.set({
    files: [
      // all files ending in "_test"
      { pattern: "test/*_test.js", watched: false },
      { pattern: "test/**/*_test.js", watched: false }
      // each file acts as entry point for the fusebox configuration
    ],

    preprocessors: {
      // add FuseBox as preprocessor
      "test/*_test.js": ["fusebox"],
      "test/**/*_test.js": ["fusebox"]
    },

    fusebox: {
      // FuseBox configuration
      homeDir: path.join(process.cwd(), "test/")
    },

    // for TypeScript
    mime: {
      "text/x-typescript": ["ts", "tsx"]
    }
  });
};
```

## Alternative Usage

This configuration is more performant, but you cannot run single test anymore (only the complete suite).

The above configuration generates a `FuseBox` bundle for each test. For many test cases this can result in many big files.

The alternative configuration creates a single bundle with all test cases.

**karma.conf.js**

```js
files: [
  // only specify one entry point
  // and require all tests in there
  'test/index_test.js'
],

preprocessors: {
  // add fusebox as preprocessor
  'test/index_test.js': [ 'fusebox' ]
},

// additional arithmetic instructions needed
// unlike WebPack FuseBox will not recognize files only by source code
fuseboxInstructions: '+ test/**_test.js',
```

**test/index_test.js**

```js
// use fusebox runtime API to load spec files
FuseBox.import("./**_test");
```

## Options

Full list of options you can specify in your `karma.conf.js`

### `fusebox`

`FuseBox` configuration (`fuse.js`)

### `fuseboxInstructions`

String with additional instructions for file bundling

## License

[MIT](./LICENSE)
