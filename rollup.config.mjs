import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default {
  input: 'dist/esm/main.js',
  output: {
    dir: 'dist/cjs',
    entryFileNames: '[name].cjs', // Change file endings to .cjs
    format: 'cjs',
    preserveModules: true, // Keeps individual modules, no bundling
  },
  plugins: [
    commonjs(),
    copy({
      targets: [
        { dest: 'dist/cjs', src: 'dist/esm/*.d.ts' },
        { dest: 'dist/cjs', src: 'dist/esm/*.d.ts.map' },
      ],
    }),
  ],
};
