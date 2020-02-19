import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/Main.vue'),
    meta: {
      title: 'Juriscloud',
      requiresAuth: true,
    },
  },

  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/Login.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
    },
  },

  {
    path: '/color-palette',
    name: 'color-palette',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/ColorPalette.vue'),
    meta: {
      title: 'Paleta de Cores',
      requiresAuth: false,
    },
  },

  {
    path: '/_playground',
    name: '_playground',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/_Playground.vue'),
    meta: {
      title: 'Playground',
      requiresAuth: false,
    },
  },
];


const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  window.currentPageTitle = to.meta.title ? to.meta.title : 'Untitled page';

  if (to.meta.requiresAuth && !store.getters['auth/isLoggedIn']) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
