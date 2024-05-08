module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['dist'],
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'clear', 'info', 'error', 'dir', 'trace']
      }
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'react/react-in-jsx-scope': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_*$', varsIgnorePattern: '^_*$' }],
    '@typescript-eslint/triple-slash-reference': 0,
    '@typescript-eslint/no-empty-interface': 1
  }
}
