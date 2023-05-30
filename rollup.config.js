import css from 'rollup-plugin-import-css';

/** @type {import('rollup').MergedRollupOptions} */
export default {
  input: 'src/main.js',
  output: [
    {
      dir: 'dist',
      format: 'es',
      name: 'bb-hud-enhander.user.js'
    }
  ],
  plugins: [
    css(),
  ],
};
