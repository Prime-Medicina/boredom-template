const { core: { chat: { sessionRepository } } } = require('juriscloud');
const getRequestContext = require('../helpers/get-request-contex');
const responseBuilder = require('../helpers/response-builder');

const methods = {
  async GET(ctx) {
    try {
      const { consumer } = ctx;
      const session = await sessionRepository.retrieveActiveByUserId(consumer.id);
      if (!session) return responseBuilder.errors.notFound(new Error('Session not found'));
      return responseBuilder.success.ok({ body: session });
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },

  async POST(ctx) {
    try {
      const {
        pathParameters: { id: sessionId },
        consumer: { id: userId },
      } = ctx;
      const session = await sessionRepository.retrieveOneByIdAndUserId(sessionId, userId);
      if (!session) return responseBuilder.errors.notFound(new Error('Session not found'));
      await sessionRepository.activate(session.id);
      return responseBuilder.success.noContent();
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },
};

module.exports.handler = async (event) => {
  const requestContext = await getRequestContext(event);
  const method = methods[requestContext.httpMethod];

  if (!method) return responseBuilder.errors.methodNotAllowed();

  return method(requestContext);
};
