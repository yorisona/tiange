module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  proseWrap: 'never',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  endOfLine: 'auto',
  vueIndentScriptAndStyle: false,
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
  arrowParens: 'avoid',
};
