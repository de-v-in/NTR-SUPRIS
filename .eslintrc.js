/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": [
    "simple-import-sort"
  ],
  "rules": {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  },
  "ignorePatterns": [
    "node_modules",
    "dist"
  ],
  "parserOptions": {
    "babelOptions": {
      "presets": [require.resolve('next/babel')
      ],
    },
  },
}