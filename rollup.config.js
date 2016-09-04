import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'lib/index.js',
  plugins: [
    babel(babelrc()),
    istanbul({
      exclude: ['test/**/*', 'node_modules/**/*']
    })
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
