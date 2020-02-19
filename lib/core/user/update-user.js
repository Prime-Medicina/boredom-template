const AWS = require('aws-sdk');
const retrieveUser = require('./retrieve-user');
const validateUserInfo = require('./validate-user');
const { USERS_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (id, userInfo) => {
  try {
    const { username } = userInfo;
    let user = await retrieveUser({ username });
    if (!user) throw new Error(`User "${username}" doesn't exist`);
    user = { user, ...userInfo };

    validateUserInfo(userInfo);

    await dynamoDB.put({
      TableName: USERS_TABLE,
      Item: user,
    }).promise();

    return user;
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  }
};
