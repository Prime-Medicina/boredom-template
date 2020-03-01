const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const retrieveUser = require('./retrieve-user');
const validateUser = require('./validate-user');
const { USERS_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (userInfo) => {
  try {
    const { username } = userInfo;
    let user = await retrieveUser({ username });

    if (user) {
      console.log(`User "${username}" already exists`);
      return user;
    }

    console.log(`User "${username}" not found, creating a new user`);
    user = {
      id: uuidv4(),
      ...userInfo,
      address: {},
    };

    validateUser(user);

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
