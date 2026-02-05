module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript"
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    requireConfigFile: false,
    ecmaVersion: 'latest',
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/valid-template-root": "off",
    "vue/multi-word-component-names": "off",
    //"vue/no-dupe-keys": "off",
  },

  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },

};
