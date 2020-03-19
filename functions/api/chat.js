const { core: { chat: { answer, sessionRepository } } } = require('juriscloud');
const getRequestContext = require('../helpers/get-request-contex');
const responseBuilder = require('../helpers/response-builder');

const methods = {
  async GET(ctx) {
    try {
      const {
        consumer: { id: userId },
      } = ctx;

      const session = await sessionRepository.retrieveActiveByUserId(userId);
      if (!session) return responseBuilder.errors.notFound(new Error('No active session for the current user'));

      const history = await sessionRepository.retrieveHistory({ sessionId: session.id });

      return responseBuilder.success.ok({
        body: history,
      });
    } catch (err) {
      return responseBuilder.genericError(err);
    }
  },

  async POST(ctx) {
    try {
      const {
        consumer,
        body: {
          section, subsection, cursor, message,
        },
      } = ctx;

      const {
        nextSection,
        nextSubsection,
        nextCursor,
        messages: answers,
        config,
      } = await answer({
        user: consumer, section, subsection, cursor, message,
      });

      return responseBuilder.success.ok({
        body: {
          nextSection,
          nextSubsection,
          nextCursor,
          answers,
          config,
        },
      });
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
