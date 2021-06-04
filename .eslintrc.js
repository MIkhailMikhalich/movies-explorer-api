module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
  ],
  rules: {
    'no-control-regex': 'off',
    'no-useless-escape': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-unused-vars': 'off',
    'no-console': 'off',
  },
};
