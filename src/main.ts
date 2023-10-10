import { createApp } from 'vue'
import App from './App.vue'
import router, { initRouteModules } from './router'
console.log('====mian')

initRouteModules().then(() => {
  createApp(App).use(router).mount('#app')
})
