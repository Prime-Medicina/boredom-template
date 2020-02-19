/**
 * @return {
 *  httpMethod,
 *  headers,
 *  multiValueHeaders,
 *  queryStringParameters,
 *  multiValueQueryStringParameters,
 *  pathParameters,
 *  body,
 *  consumer,
 * }
 */
module.exports = async (event) => {
  const {
    requestContext: {
      authorizer: {
        consumer,
      },
    },
    httpMethod,
    headers,
    multiValueHeaders,
    body,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
  } = event;

  return {
    httpMethod,
    headers,
    multiValueHeaders,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
    body: JSON.parse(body),
    consumer: JSON.parse(consumer),
  };
};
