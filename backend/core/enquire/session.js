const AWS = require('aws-sdk');
const { SESSION_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const create = (userId) => dynamoDB.put({
  TableName: SESSION_TABLE,
  Item: {
    userId,
    step: 0,
    history: [],
  },
}).promise();

const retrieve = (userId) => dynamoDB.get({
  TableName: SESSION_TABLE,
  Key: { userId },
}).promise().then((response) => response.Item);

const update = async (userId, { step, question, answer }) => {
  const currentSession = await retrieve(userId);
  if (!currentSession) throw new Error(`Session not found for user "${userId}"`);

  currentSession.step = step;
  if (question) currentSession.history.push(question);
  if (answer) currentSession.history.push(answer);

  await dynamoDB.put({
    TableName: SESSION_TABLE,
    Item: currentSession,
  }).promise();
};

module.exports = {
  create,
  retrieve,
  update,
};
