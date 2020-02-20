export default (request) => ({

  async session() {
    const { data } = await request.get('/session');
    return data;
  },

  async answer(cursor, message) {
    const { data } = await request.post('/chat', { cursor, message });
    return data;
  },

});
