import css from 'rollup-plugin-import-css';
import {resolve} from 'path';

/** @type {import('rollup').MergedRollupOptions} */
export default {
  input: 'src/main.js',
  output: [
    {
      file: resolve('dist/bb-hud-enh.user.js'),
      format: 'es',
      name: 'bb-hud-enhander.user.js'
    }
  ],
  plugins: [
    css(),
  ],
};
