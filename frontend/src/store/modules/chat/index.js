import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  cursor: '',
  /*
   TODO
   */
  requirements: null,
  /*
    [{
      from,
      text,
      timestamp,
    }]
   */
  messages: [],
  isTyping: false,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
