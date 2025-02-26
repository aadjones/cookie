module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    react: { version: '18.2' },
  },
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['.next/**/*', 'node_modules/**/*', 'build/**/*', 'dist/**/*', 'coverage/**/*'],
};
