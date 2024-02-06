module.exports = {
  // ...
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: ['plugin:adonis/typescriptApp'],
  rules: {
    'space-before-function-paren': ['error', 'always'],
  },
  // ...
}
