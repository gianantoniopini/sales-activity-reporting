import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('./components/Home.vue')
  },
  {
    path: '/salesactivity',
    name: 'salesActivity',
    component: () => import('./components/SalesActivity.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
