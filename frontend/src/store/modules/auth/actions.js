export const login = async ({ commit }, user) => commit('loggedIn', user);

export const logout = ({ commit }) => commit('loggedOut');
