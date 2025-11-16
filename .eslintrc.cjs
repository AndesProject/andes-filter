module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'always',
        prev: ['block', 'block-like', 'multiline-block-like', 'class'],
        next: '*',
      },
      { blankLine: 'always', prev: 'function', next: 'function' },
      { blankLine: 'always', prev: 'block-like', next: 'function' },
      { blankLine: 'always', prev: 'function', next: 'block-like' },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', 'webpack.config.js', '*.test.ts'],
}
