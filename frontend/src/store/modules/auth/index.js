import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  loggedIn: false,
  /*
  {
    profile: {
      name,
      givenName,
      familyName,
      imageUrl,
      email,
    },
    response: {
      accessToken,
      idToken,
      scope,
      expiresIn,
      firstIssuedAt,
      expiresAt,
    },
  }
   */
  user: {
    profile: {},
    response: {},
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
