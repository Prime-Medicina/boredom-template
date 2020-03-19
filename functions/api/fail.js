const responseBuilder = require('../helpers/response-builder');

const throwError = (pathParameters) => {
  const err = new Error();
  err.status = pathParameters.status;
  err.message = pathParameters.message;
  throw err;
};

module.exports.handler = async (event) => {
  try {
    return responseBuilder.genericError(throwError(event.pathParameters));
  } catch (err) {
    return responseBuilder.genericError(err);
  }
};
