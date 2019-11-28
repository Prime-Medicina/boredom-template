const responseBuilder = require('../helpers/response-builder');
const responseError = require('../helpers/response-error');

const throwError = (pathParameters) => {
  const err = new Error();
  err.status = pathParameters.status;
  err.message = pathParameters.message;
  throw err;
};

module.exports.handler = async (event) => {
  try {
    return responseBuilder(throwError(event.pathParameters));
  } catch (err) {
    return responseError(err);
  }
};
