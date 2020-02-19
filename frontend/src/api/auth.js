export default (request) => ({

  login() {
    console.log(!!request);
    throw new Error('Not implemented');
  },

  logout() {
    console.log(!!request);
    throw new Error('Not implemented');
  },

});
