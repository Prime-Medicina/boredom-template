const AWS = require('aws-sdk');
const { USERS_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async ({ id, username }) => {
  let item;

  if (id) {
    item = (await dynamoDB.get({
      TableName: USERS_TABLE,
      Key: { id },
    }).promise()).Item;
  }

  if (username) {
    [item] = (await dynamoDB.query({
      TableName: USERS_TABLE,
      IndexName: 'username',
      KeyConditionExpression: '#username = :username',
      ExpressionAttributeNames: {
        '#username': 'username',
      },
      ExpressionAttributeValues: {
        ':username': username,
      },
      Limit: 1,
    }).promise()).Items;
  }

  return item;
};
