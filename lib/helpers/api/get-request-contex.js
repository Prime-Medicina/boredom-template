/**
 * Returns a normalized request context object from an ApiGateway request event.
 *
 * @return {Promise<Object>} requestContext
 * @return {String} requestContext.httpMethod
 * @return {Object} requestContext.headers
 * @return {Object} requestContext.multiValueHeaders
 * @return {Object} requestContext.queryStringParameters
 * @return {Object} requestContext.multiValueQueryStringParameters
 * @return {Object} requestContext.pathParameters
 * @return {*} requestContext.body
 * @return {Object|null} requestContext.consumer
 */
export default async (event) => {
  const {
    requestContext,
    httpMethod,
    headers,
    multiValueHeaders,
    body,
    queryStringParameters,
    multiValueQueryStringParameters,
    pathParameters,
    path,
    resource,
  } = event

  const { authorizer } = requestContext || {}
  const { consumer } = authorizer || {}

  let parsedBody
  let parsedConsumer

  try {
    parsedBody = typeof body === 'string' ? JSON.parse(body) : undefined
    parsedConsumer = typeof consumer === 'string' ? JSON.parse(consumer) : undefined
  } catch (err) {
    console.error('Error parsing body or consumer', err)
  }

  return {
    httpMethod: (httpMethod || '').toUpperCase(),
    headers: headers || {},
    multiValueHeaders: multiValueHeaders || {},
    queryStringParameters: queryStringParameters || {},
    multiValueQueryStringParameters: multiValueQueryStringParameters || {},
    pathParameters: pathParameters || {},
    body: parsedBody,
    consumer: parsedConsumer,
    path,
    resource,
  }
}
