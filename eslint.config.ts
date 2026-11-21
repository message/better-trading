// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import js from '@eslint/js';
import { flatConfigs as importXFlatConfig } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs as storybookConfigs } from 'eslint-plugin-storybook';
import { browser, es2020, node } from 'globals';
import { version as reactVersion } from 'react';
import { configs as tsConfigs, parser as tsParser } from 'typescript-eslint';
import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  // Shared configs
  js.configs.recommended,
  ...tsConfigs.recommended,
  jsxA11y.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  importXFlatConfig.recommended,
  importXFlatConfig.typescript,
  reactHooks.configs.flat.recommended,
  // Keep these two as separate entries. Spread into one object, jsx-runtime's `rules` (two rules turned off)
  // replaced recommended's whole `rules` object, which silently disabled every react/* rule (jsx-key and others)
  { files: ['**/*.{ts,tsx}'], ...reactPlugin.configs.flat.recommended },
  { files: ['**/*.{ts,tsx}'], ...reactPlugin.configs.flat['jsx-runtime'] },
  // Custom config
  {
    ignores: [
      '**/.wxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/old-extension/**',
      '**/*.module.scss',
      '**/.storybook/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
      },
      globals: {
        ...browser,
        ...es2020,
        ...node,
        chrome: 'readonly',
      },
    },
    settings: {
      react: {
        // Not 'detect': eslint-plugin-react 7 detects the version through context.getFilename(), which ESLint 10
        // removed, so linting crashes. Reading it from the installed react keeps it current without hardcoding;
        // switch back to 'detect' once eslint-plugin-react supports ESLint 10
        version: reactVersion,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['../*'], message: 'Use the `@/` alias instead of parent-relative imports.' }] },
      ],
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'arrow-body-style': ['error', 'as-needed'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      'import-x/order': [
        'error',
        {
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
          pathGroups: [
            {
              pattern: '@*/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
        },
      ],
      'import-x/no-unresolved': 'off',
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-deprecated': 'error',
      'import-x/no-duplicates': ['error', { considerQueryString: true, 'prefer-inline': false }],
      'import-x/consistent-type-specifier-style': 'error',
      'import-x/exports-last': 'error',
      'import-x/first': 'error',
      // ponytail: React Compiler rules from react-hooks 7 flag existing, working code; warn until it is refactored
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  ...storybookConfigs['flat/recommended'],
];

export default config;
