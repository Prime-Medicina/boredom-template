export default (request) => ({

  async session() {
    const { data } = await request.get('/session');
    return data;
  },

  async history() {
    const { data } = await request.get('/chat');
    return data;
  },

  async answer({
    cursor, section, subsection, message,
  }) {
    const { data } = await request.post('/chat', {
      cursor, section, subsection, message,
    });
    return data;
  },

});
