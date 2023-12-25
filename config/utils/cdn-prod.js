module.exports = {
  externals: {
    'mockjs': 'Mock',
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vue-i18n': 'VueI18n',
    'axios': 'axios',
  },
  js: [
    'https://cdn.staticfile.org/vue/3.3.4/vue.global.prod.min.js',
    'https://cdn.staticfile.org/vue-router/4.2.2/vue-router.global.prod.min.js',
    'https://cdn.staticfile.org/vue-i18n/9.2.2/vue-i18n.global.prod.min.js',
    'https://cdn.staticfile.org/axios/1.4.0/axios.min.js',
  ],
  css: [],
}
