import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/Main.vue'),
  },

  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/About.vue'),
  },

  {
    path: '/color-palette',
    name: 'color-palette',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/ColorPalette.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
