const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

module.exports = (options) => {
  const statusCode = options.statusCode || 200;
  const headers = { ...defaultHeaders, ...options.headers };
  const body = options.body ? JSON.stringify(options.body) : undefined;

  return {
    ...options,
    statusCode,
    headers,
    body,
  };
};
