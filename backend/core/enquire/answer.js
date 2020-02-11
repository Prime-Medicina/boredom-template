const session = require('./session');

module.exports = async (userId, answer) => {
  const currentSession = await session.retrieve();
};
