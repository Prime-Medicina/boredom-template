const AWS = require('aws-sdk');
const { SESSION_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const wrapMessage = (message, from) => ({
  content: message,
  from,
  timestamp: Date.now(),
});

const create = async (userId) => {
  const sessionItem = {
    userId,
    currentCursor: null,
    currentRequirements: null,
    history: {},
  };

  await dynamoDB.put({
    TableName: SESSION_TABLE,
    Item: sessionItem,
  }).promise();

  return sessionItem;
};

const retrieve = (userId) => dynamoDB.get({
  TableName: SESSION_TABLE,
  Key: { userId },
}).promise().then((response) => response.Item);

const update = async (session, {
  cursor, requirements, messages, answer,
}) => {
  const currentSession = { ...session };

  const history = [];
  if (answer && answer.length) history.push(wrapMessage(answer, 'me'));
  if (messages.length > 0) history.push(...messages.map((m) => wrapMessage(m, 'bot')));

  currentSession.currentCursor = cursor;
  currentSession.currentRequirements = requirements;
  currentSession.history = currentSession.history || {};
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
