module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:node/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": "warn",
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
  },
};
