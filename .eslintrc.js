const unusedvarsReg =
  '^(?:_|h|(?:props|ctx|row|column|key|value|val|\\$?index|event|payload|file|fileList|response|rest|args)$)';

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },
  rules: {
    // 禁止不必要的转义字符
    'no-useless-escape': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    eqeqeq: 'error',
    radix: process.env.NODE_ENV === 'development' ? 'error' : 'warn',
    'id-length':
      process.env.NODE_ENV === 'development'
        ? ['off', { exceptions: ['_', 'h', 'x', 'y', 'i', 'j', 'k', 'e', 't', 'n', 'o', 'v'] }]
        : 'off',
    'no-var': 'warn',
    camelcase: [
      'off',
      {
        properties: 'never',
        ignoreDestructuring: true,
      },
    ],
    'no-unused-vars': 'off',
    'no-control-regex': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/camelcase': [
      'off',
      {
        properties: 'never',
        ignoreDestructuring: true,
      },
    ],
    '@typescript-eslint/ban-ts-comment': ['off'],
    'vue/no-mutating-props': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'vue/no-useless-template-attributes': 'off',
    // 对空对象进行析构
    'no-unsafe-optional-chaining': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: unusedvarsReg,
        ignoreRestSiblings: true,
        argsIgnorePattern: unusedvarsReg,
      },
    ],
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true, ignoreProperties: true },
    ],
  },
  globals: {
    Vue: false,
    echarts: false,
    ElementUI: false,
  },
};
