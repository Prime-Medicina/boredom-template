const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const retrieveUser = require('./retrieve-user');
const validateUserInfo = require('./validate-user-info');
const { USERS_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (userInfo) => {
  try {
    validateUserInfo(userInfo);

    const { username } = userInfo;
    let user = await retrieveUser({ username });

    if (user) {
      console.log(`User "${username}" already exists`);
      return user;
    }

    console.log(`User "${username}" not found, creating a new user`);
    user = { id: uuidv4(), ...userInfo };

    await dynamoDB.put({
      TableName: USERS_TABLE,
      Item: user,
    }).promise();

    return user;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};
