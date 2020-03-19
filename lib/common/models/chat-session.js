const { v4: uuid } = require('uuid');

const wrapSession = ({
  id = uuid(),
  userId,
  section = null,
  subsection = null,
  cursor = null,
  config = {},
  finished = false,
  createdAt = Date.now(),
  updatedAt = Date.now(),
}) => {
  if (!userId) throw new Error('Missing "userId" argument');
  return {
    id,
    userId,
    section,
    subsection,
    cursor,
    config,
    finished,
    createdAt,
    updatedAt,
  };
};

module.exports = wrapSession;
