const responseBuilder = require('./response-builder');

module.exports = (err) => {
  console.error('Responding with error:', err);

  const status = err.status || (err.response ? err.response.status : 500);
  const message = err.message || 'Internal server error';

  return responseBuilder({
    statusCode: status,
    body: { message },
  });
};
