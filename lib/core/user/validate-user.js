module.exports = (user) => {
  if (!user.username) throw new Error('Missing username');
};
