module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    indent: ["error", 4],
    "linebreak-style": ["error", "unix"],
    quotes: [
      "error",
      "double",
      { allowTemplateLiterals: true, avoidEscape: true },
    ],
    semi: ["error", "always"],
    "no-empty": ["error", { allowEmptyCatch: true }],
  },
};
