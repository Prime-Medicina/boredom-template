const { core: { enquire: { answer } } } = require('juriscloud');
const getRequestContext = require('../helpers/get-request-contex');
const responseBuilder = require('../helpers/response-builder');
const responseError = require('../helpers/response-error');

module.exports.handler = async (event) => {
  try {
    const { consumer, body: { cursor, message } } = await getRequestContext(event);
    const { cursor: nextCursor, answers, requirements } = await answer({
      consumer, cursor, message,
    });
    return responseBuilder({
      body: {
        cursor: nextCursor,
        answers,
        requirements,
      },
    });
  } catch (err) {
    return responseError(err);
  }
};
