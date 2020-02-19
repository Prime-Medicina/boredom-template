const responseBuilder = require('../helpers/response-builder');
const responseError = require('../helpers/response-error');

const pkg = require('../../package.json');

/**
 * @api {get} / Health check
 * @apiName HealthCheck
 * @apiGroup Health
 *
 * @apiSuccess {String} message Project name and version.
 */
module.exports.handler = async () => {
  try {
    return responseBuilder({
      body: {
        message: `${pkg.name}: ${pkg.version}`,
      },
    });
  } catch (err) {
    return responseError(err);
  }
};
