module.exports = (userInfo) => {
  if (!userInfo.username) throw new Error('Missing username');
};
