import { RouteRecordRaw } from 'vue-router'
export default <Readonly<RouteRecordRaw[]>>[
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
  },
]
