module.exports = {
  extends: ["prettier", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["eslint-plugin-prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    strict: 0,
    "no-console": "warn",
    "no-sequences": "warn",
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
  },
};