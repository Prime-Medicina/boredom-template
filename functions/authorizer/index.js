const { core: { auth: { authenticate, register } } } = require('juriscloud');
const { getGoogleTokenInfo, createAccessPolicy } = require('./lib');

const getGoogleAuthCredentials = async (token) => {
  let credentials = {};

  try {
    credentials = await getGoogleTokenInfo(token);
  } catch (err) {
    console.error('Error retrieving Google token info', err);
  }

  if (credentials.error_description) {
    console.error('Google token error:', credentials.error_description);
    throw new Error('Unauthorized');
  }

  if (credentials.email_verified !== 'true') {
    console.log(`${credentials.email} is not a verified email`);
    throw new Error('Unauthorized');
  }

  const userInfo = {
    username: credentials.email,
    name: credentials.name,
    picture: credentials.picture,
  };

  let user;
  try {
    user = await authenticate(userInfo);
  } catch (err) {
    if (err.status !== 401) throw err;
    user = await register(userInfo);
  }

  return { user, key: user.username };
};

const signin = (type, token) => getGoogleAuthCredentials(token);

const authorizer = async ({ type, authorizationToken, methodArn }) => {
  const { user, key } = await signin(type, authorizationToken);
  return createAccessPolicy(user, key, methodArn);
};

module.exports.handler = async (event) => {
  try {
    return await authorizer(event);
  } catch (err) {
    console.error('Authorization error:', err);
    throw new Error('Unauthorized');
  }
};
