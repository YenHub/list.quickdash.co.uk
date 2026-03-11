import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import js from '@eslint/js'
import reactDom from 'eslint-plugin-react-dom'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactX from 'eslint-plugin-react-x'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  /** Global Config */
  globalIgnores(['dist', 'node_modules']),

  /** TypeScript Specific Config */
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,

      // Type aware lint rules
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,

      reactRefresh.configs.vite,

      // Lint rules for React
      reactHooks.configs.flat.recommended,
      reactX.configs['recommended-typescript'],

      // Lint rules for React DOM
      reactDom.configs.recommended,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      /** built-ins */
      'arrow-body-style': ['error', 'as-needed'],
      curly: ['error', 'multi'],
      'default-case': 'warn',
      eqeqeq: ['error', 'smart'],

      /** stylistic rules */
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/new-parens': 'error',

      /** typescript-eslint rules */
      '@typescript-eslint/prefer-regexp-exec': 'off',
      'no-empty-function': 'off', // Disable built-in
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: true, ignoreProperties: true },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true },
      ],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,

      // Enable type-aware linting
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,

        // Support import sorting
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  },
])
