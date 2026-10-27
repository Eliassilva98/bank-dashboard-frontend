import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      prettierConfig,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },

  {
    files: ['**/*.test.{js,jsx}', 'jest.setup.js', 'jest.polyfills.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.jest }
    }
  },

  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly'
      }
    }
  },

  {
    files: ['cypress.config.js'],
    languageOptions: {
      globals: globals.node
    }
  },

  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: globals.node
    }
  }
])
