import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

// TODO: run a script file on `| entr` and print status, timestamp stead of just invoking rollup -c
export default {
  plugins: [babel(babelrc())],
  entry: 'src/index.js',
  // dest: 'dist/statechartjs-graph.js',
  targets: [
    {
      dest: 'dist/statechartjs-graph.js'
    }
    // can be more
  ],
  format: 'umd',
  moduleName: "statechartjsGraph",
  external: [
    'statechartjs'
  ],
  globals: {}
};
