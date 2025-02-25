import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
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
    replace({
      delimiters: ["'", "'"],
      preventAssignment: true,
      values: {
        yoctocolors: JSON.stringify('yoctocolors-cjs'),
      },
    }),
    commonjs(),
    copy({
      targets: [
        { dest: 'dist/cjs', src: 'dist/esm/*.d.ts' },
        { dest: 'dist/cjs', src: 'dist/esm/*.d.ts.map' },
      ],
    }),
  ],
};
