import { createRouter, createWebHistory } from 'vue-router'

function getRouterBase() {
  const path = location.pathname
  const base = path.substring(0, path.lastIndexOf('/'))
  return base
}

const router = createRouter({
  history: createWebHistory(getRouterBase()),
  routes: [],
})

const modules = require.context('./modules', false, /^(?!.*template\.ts).*\.ts$/)

async function formatModules(_context: __WebpackModuleApi.RequireContext, result) {
  const keys = _context.keys()
  const modules: any[] = []
  for (const key of keys) {
    const defaultModule = (await _context(key)).default
    if (!defaultModule) continue
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    modules.push(...moduleList)
  }
  return [...result, ...modules]
}

export async function initRouteModules() {
  const routes = await formatModules(modules, [])
  routes.forEach(route => {
    router.addRoute(route)
  })
}

export default router
