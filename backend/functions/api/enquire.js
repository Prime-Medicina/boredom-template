const { enquire: { answer } } = require('juriscloud-core');
const responseBuilder = require('../helpers/response-builder');
const responseError = require('../helpers/response-error');

module.exports.handler = async (event) => {
  try {
    const {  } = event;
    const response = next({  });
    return responseBuilder();
  } catch (err) {
    return responseError(err);
  }
};
