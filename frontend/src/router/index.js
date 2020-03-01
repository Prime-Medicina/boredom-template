import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/Chat.vue'),
    meta: {
      title: 'JurisCloud',
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
  // Redirects
  {
    path: '/',
    redirect: 'chat',
  },
  // Errors
  {
    path: '*',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/PageNotFound.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : 'Untitled page';

  if (to.meta.requiresAuth && !store.getters['auth/isLoggedIn']) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
