const { createUser } = require('../user');

module.exports = async (userInfo) => {
  try {
    return await createUser(userInfo);
  } catch (err) {
    console.error('Error registering a new user', err);
    throw err;
  }
};
