module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-unused-vars": ["error", { args: "all" }],
    "no-empty-pattern": "off",
    curly: "error",
    "no-var": "error",
    "no-multi-spaces": "error",
    "space-in-parens": "error",
    "array-callback-return": "warn",
    "block-scoped-var": "warn",
  },
};
