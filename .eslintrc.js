module.exports =  {
  plugins: ["prettier"],
  parser:  "@typescript-eslint/parser",
  extends:  [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  "module",
  },
  rules:  {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "sort-imports": ["error", {
      "ignoreCase": true
    }],
    "no-duplicate-imports": "error"
  }
};