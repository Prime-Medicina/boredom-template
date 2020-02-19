const AWS = require('aws-sdk');
const { SESSION_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const create = (userId) => dynamoDB.put({
  TableName: SESSION_TABLE,
  Item: {
    userId,
    currentCursor: null,
    currentRequirements: null,
    history: {},
  },
}).promise();

const retrieve = (userId) => dynamoDB.get({
  TableName: SESSION_TABLE,
  Key: { userId },
}).promise().then((response) => response.Item);

const update = async (session, {
  cursor, requirements, messages, answer,
}) => {
  const currentSession = { ...session };

  const history = [];
  if (answer && answer.length) history.push(answer);
  if (messages.length > 0) history.push(...messages);

  currentSession.currentCursor = cursor;
  currentSession.currentRequirements = requirements;
  currentSession.history[cursor] = history;

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
