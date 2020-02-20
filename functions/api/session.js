const { core: { chat: { session: sessionManager } } } = require('juriscloud');
const getRequestContext = require('../helpers/get-request-contex');
const responseBuilder = require('../helpers/response-builder');
const responseError = require('../helpers/response-error');
const NotFoundError = require('../errors/not-found.error');

module.exports.handler = async (event) => {
  try {
    const { consumer } = await getRequestContext(event);
    const session = await sessionManager.retrieve(consumer.id);
    if (!session) throw new NotFoundError('Session not found');
    return responseBuilder({ body: session });
  } catch (err) {
    return responseError(err);
  }
};
