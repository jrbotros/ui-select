module.exports = {
  extends: 'airbnb',
  installedESLint: true,
  rules: {
    'no-control-regex': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
