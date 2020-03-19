module.exports = class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super();
    this.message = message;
    this.statusCode = 404;
  }
};
