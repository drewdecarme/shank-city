const path = require("path");

module.exports = {
  extends: "@flare-city/eslint-config",
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.json"),
  },
};
