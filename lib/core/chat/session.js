const AWS = require('aws-sdk');
const { models: { chatMessage: wrapMessage } } = require('../../common');
const { SESSION_TABLE } = require('../config');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const create = async (userId) => {
  const sessionItem = {
    userId,
    currentCursor: null,
    currentConfig: null,
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
  cursor, config, messages, answer,
}) => {
  const currentSession = { ...session };

  const history = [];
  if (answer.content && String(answer.content).length) {
    history.push(wrapMessage({ ...answer, from: 'me' }));
  }
  if (messages.length > 0) {
    history.push(...messages.map((m) => wrapMessage({ content: m, from: 'bot' })));
  }

  currentSession.currentCursor = cursor;
  currentSession.currentConfig = config;
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
