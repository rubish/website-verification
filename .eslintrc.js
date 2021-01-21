module.exports = {
  env: {
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': 0,
  },
};
