const sections = require('../../common/enums/chat-sections');
const actions = require('./actions');
const reconnaissance = require('./reconnaissance');

module.exports = ({
  section, subsection, cursor, context,
}) => {
  if (!section && !subsection && cursor) {
    return actions(cursor, context);
  }

  switch (section) {
    case sections.reconnaissance:
      return reconnaissance(subsection, cursor, context);
    default:
      throw new Error(`Invalid section "${section}"`);
  }
};
