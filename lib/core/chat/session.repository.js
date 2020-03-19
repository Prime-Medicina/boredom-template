const AWS = require('aws-sdk');
const { models: { chatMessage: wrapMessage, chatSession: wrapSession } } = require('../../common');
const { SESSION_TABLE } = require('../config');
const NotFoundError = require('../errors/NotFoundError');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const get = ({ partition, sort }) => dynamoDB.get({
  TableName: SESSION_TABLE,
  Key: {
    __pk: partition,
    __sk: sort,
  },
}).promise().then((response) => response.Item);

const put = ({ partition, sort, item }) => dynamoDB.put({
  TableName: SESSION_TABLE,
  Item: {
    ...item,
    __pk: partition,
    __sk: sort,
  },
}).promise();

async function* queryGenerator({ partition, sort, limit = 0 }) {
  const KeyConditionExpression = sort
    ? '#partition = :partition AND BEGINS_WITH(#sort, :sort)'
    : '#partition = :partition';

  const ExpressionAttributeNames = sort
    ? {
      '#partition': '__pk',
      '#sort': '__sk',
    } : {
      '#partition': '__pk',
    };

  const ExpressionAttributeValues = sort
    ? {
      ':partition': partition,
      ':sort': sort,
    } : {
      ':partition': partition,
    };

  let Items;
  let LastEvaluatedKey;
  do {
    ({ Items, LastEvaluatedKey } = await dynamoDB.query({
      TableName: SESSION_TABLE,
      KeyConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      Limit: limit,
      LastEvaluatedKey,
      ScanIndexForward: true,
    }).promise());
    yield* Items;
  } while (LastEvaluatedKey);
}

const query = async ({ partition, sort, limit }) => {
  const items = [];
  for await (const item of queryGenerator({ partition, sort, limit })) {
    items.push(item);
  }
  return items;
};

const create = async (userId, cursor) => {
  const session = wrapSession({
    userId,
    cursor,
  });

  await put({
    partition: `sessions#${userId}`,
    sort: session.id,
    item: session,
  });

  return session;
};

const retrieveOneByIdAndUserId = (id, userId) => get({
  partition: `sessions#${userId}`,
  sort: id,
});

const retrieveActiveByUserId = async (userId = null) => {
  const active = await get({
    partition: 'active',
    sort: userId,
  });
  if (!active) return null;
  return retrieveOneByIdAndUserId(active.sessionId, userId);
};

const retrieveAllByUserId = (userId, limit = 50) => query({
  partition: `sessions#${userId}`,
  limit,
});

const retrieveHistory = ({ sessionId, cursor, limit = 500 }) => query({
  partition: `messages#${sessionId}`,
  sort: cursor,
  limit,
});

const activate = async (id, userId) => {
  const session = await retrieveOneByIdAndUserId(id, userId);
  if (!session) throw new NotFoundError('Session not found');
  return put({
    partition: 'active',
    sort: session.userId,
    item: {
      sessionId: id,
    },
  });
};

const update = async (session, {
  nextSection,
  nextSubsection,
  nextCursor,
  config,
  messages,
  answer,
}) => {
  const updatingSession = { ...session };

  updatingSession.section = nextSection;
  updatingSession.subsection = nextSubsection;
  updatingSession.cursor = nextCursor;
  updatingSession.config = config;
  updatingSession.updatedAt = Date.now();

  if (answer.content && String(answer.content).length) {
    // answer is always from the last cursor
    const msg = wrapMessage(answer);
    await put({
      partition: `messages#${session.id}`,
      sort: `${session.cursor}#${msg.id}`,
      item: msg,
    });
  }

  if (messages.length > 0) {
    // messages are always from the next cursor
    for (const message of messages) {
      const msg = wrapMessage({ content: message, from: 'bot' });
      await put({
        partition: `messages#${session.id}`,
        sort: `${nextCursor}#${msg.id}`,
        item: msg,
      });
    }
  }

  await put({
    partition: `sessions#${session.userId}`,
    sort: session.id,
    item: updatingSession,
  });
};

module.exports = {
  create,
  update,
  activate,
  retrieveOneByIdAndUserId,
  retrieveAllByUserId,
  retrieveActiveByUserId,
  retrieveHistory,
};
