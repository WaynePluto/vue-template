module.exports = {
  'files': ['src/**/*.{js,jsx,ts,tsx,vue}'],
  'ignores': ['**/*.config.js'],
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/base'],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': ['.eslintrc.{js,cjs}'],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'parser': '@typescript-eslint/parser',
    'sourceType': 'module',
  },
  'plugins': ['@typescript-eslint', 'vue'],
  'rules': {
    'eqeqeq': ['error', 'always'],
    'no-undef': 'off',
  },
}
