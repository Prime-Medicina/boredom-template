export default (request) => ({

  async answer(cursor, message) {
    const { data } = await request.post('/enquire', { cursor, message });
    return data;
  },

});
