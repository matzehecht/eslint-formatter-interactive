import boehringer from '@boehringer-ingelheim/eslint-config';
import prettier from 'eslint-plugin-prettier/recommended';

export default boehringer.config(
  boehringer.includeIgnoreFile(),
  boehringer.configs.strict,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.*js', '.*.*js', '*.*ts', '.*.*ts'],
        },
      },
    },
  },
  // Following needs eslint-plugin-prettier to be installed as described by https://github.com/prettier/eslint-plugin-prettier
  // Should be second to last
  prettier,
  // Should be last
  boehringer.configs.prettierDisable,
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'sonarjs/no-duplicate-string': 'off',
    },
  },
);
