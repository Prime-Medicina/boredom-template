const AWS = require('aws-sdk');
const { USERS_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async ({ username }) => (await dynamoDB.get({
  TableName: USERS_TABLE,
  Key: { username },
}).promise()).Item;
