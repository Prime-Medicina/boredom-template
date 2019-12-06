const responseBuilder = require('../helpers/response-builder');
const responseError = require('../helpers/response-error');

module.exports.handler = async (event) => {
  try {
    console.log(event);
    return responseBuilder();
  } catch (err) {
    return responseError(err);
  }
};
