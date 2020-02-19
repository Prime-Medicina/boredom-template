export const isLoggedIn = (state, getters) => {
  if (!state.loggedIn) return false;
  const { loggedUser } = getters;
  return loggedUser.response.expiresAt > Date.now();
};

export const loggedUser = (state) => state.user;
