/**
 * ESLint 配置文件
 * 遵循 Google JavaScript 代码规范
 * 参考: https://github.com/google/eslint-config-google
 */

module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'google',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // 允许 console（后端日志需要）
    'no-console': 'off',
    // 允许 require（某些模块可能需要）
    'require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
      },
    }],
    // 最大行长度（Google 默认 80，这里放宽到 100）
    'max-len': ['error', {
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    // 允许使用 async/await
    'require-await': 'error',
    // 对象末尾逗号
    'comma-dangle': ['error', 'always-multiline'],
    // 缩进使用 2 个空格
    'indent': ['error', 2],
    // 引号使用单引号
    'quotes': ['error', 'single'],
    // 分号
    'semi': ['error', 'always'],
    // 箭头函数参数括号
    'arrow-parens': ['error', 'always'],
    // 对象大括号内空格
    'object-curly-spacing': ['error', 'always'],
    // 数组大括号内空格
    'array-bracket-spacing': ['error', 'never'],
  },
};
