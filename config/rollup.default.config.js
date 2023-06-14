import css from 'rollup-plugin-import-css';
import {resolve} from 'path';

/** @type {import('rollup').MergedRollupOptions} */
export default {
  input: 'src/main.js',
  output: [
    {
      file: resolve('dist/main.js'),
      format: 'es',
    }
  ],
  plugins: [
    css(),
  ],
};
