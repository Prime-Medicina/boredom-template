import Vue from 'vue';

export const loggedIn = (state, { profile, response }) => {
  Vue.set(state.user, 'profile', profile);
  Vue.set(state.user, 'response', response);
  Vue.set(state, 'loggedIn', true);
};

export const loggedOut = (state) => {
  Vue.set(state.user, 'profile', {});
  Vue.set(state.user, 'response', {});
  Vue.set(state, 'loggedIn', false);
};
