const AWS = require('aws-sdk');
const retrieveUser = require('./retrieve-user');
const validateUser = require('./validate-user');
const { USERS_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (id, userInfo) => {
  try {
    let user = await retrieveUser({ id });
    if (!user) throw new Error(`User "${id}" doesn't exist`);
    user = { ...user, ...userInfo };

    validateUser(user);

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
