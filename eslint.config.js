import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'playwright-report/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...tseslint.configs['eslint-recommended']?.rules,
      ...tseslint.configs['recommended']?.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      'no-console': 1,
      'prettier/prettier': 1,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
