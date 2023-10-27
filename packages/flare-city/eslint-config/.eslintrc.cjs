module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    ".eslintrc.cjs",
    "bin/",
    "node_modules/",
    "dist/",
    "vitest.config.ts",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
