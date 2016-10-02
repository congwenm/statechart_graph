// import babel from 'rollup-plugin-babel';
// import babelrc from 'babelrc-rollup';
// import istanbul from 'rollup-plugin-istanbul';

// import uglify from 'rollup-plugin-uglify';
// import { minify } from 'uglify-js'; // use uglify's harmony branch to minify es2016 code

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

import { rollup } from 'rollup'

module.exports = {
  entry: 'lib/index.js',
  plugins: [
    // babel(babelrc()),
    // istanbul({
    //   exclude: ['test/**/*', 'node_modules/**/*']
    // })    
    // uglify({}, minify)
  ],
  external: [...external],
  targets: [
    // sandbox
    {
      dest: './sandbox/statechart-graph.js',
      format: 'umd',
      moduleName: 'statechart_graph',
      sourceMap: true
    },

    // chrome-extension
    {
      dest: './chrome-extension/Panel/Graph/statechart-graph.js',
      format: 'umd',
      moduleName: 'statechart_graph',
      sourceMap: true
    },

    // dist
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'statechart_graph',
      sourceMap: true
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es',
      sourceMap: true
    }
  ],
  globals: {

  }
};
