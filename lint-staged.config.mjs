/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.json': ['prettier --write', 'git add --force'],
  '*.{js,jsx,ts,tsx}': [
    // Extend rule set of .eslintrc.js with 'no-console'
    "eslint --fix --rule 'no-console: [error, { allow: [warn, error] }]'",
    'git add --force',
  ],
};
