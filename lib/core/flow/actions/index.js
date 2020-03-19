const chatCursors = require('../../../common/enums/chat-cursors');
const initialize = require('./initialize');

module.exports = (cursor, context) => {
  switch (cursor) {
    case chatCursors.initialize:
      return initialize(context);
    default:
      throw new Error(`Invalid action cursor "${cursor}"`);
  }
};
