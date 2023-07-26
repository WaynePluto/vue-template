import { createApp } from 'vue'
import App from './App.vue'
import router, { initRouteModules } from './router'

initRouteModules().then(() => {
  createApp(App).use(router).mount('#app')
})
