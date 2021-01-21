module.exports = {
  env: {
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': 0,
    'max-len': ['error', { code: 120, ignoreUrls: true }],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        // args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '_.*',
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
