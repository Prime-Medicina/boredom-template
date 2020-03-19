const subsections = require('../../../common/enums/chat-subsections');
const basicInfo = require('./basic-info');

module.exports = (subsection, cursor, context) => {
  switch (subsection) {
    case subsections.basicInfo:
      return basicInfo(cursor, context);
    default:
      throw new Error('Invalid cursor');
  }
};
