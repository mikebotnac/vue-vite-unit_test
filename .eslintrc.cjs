module.exports = {
  extends: 'airbnb',
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: 'module',
  },
  extends: [
    "plugin:vue/vue3-essential",
  ],
  root: true,
  env: {
    node: true,
    browser: true
  },
};