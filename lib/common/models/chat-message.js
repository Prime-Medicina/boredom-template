const { v4: uuid } = require('uuid');

const wrapMessage = ({
  id = uuid(),
  type = 'message',
  content,
  mask,
  from,
  timestamp = Date.now(),
  // Frontend control
  delivered = false,
  failed = false,
}) => {
  if (!from) throw new Error('Missing "from" argument');
  return {
    id,
    type,
    content,
    mask,
    from,
    timestamp,
    delivered,
    failed,
  };
};

module.exports = wrapMessage;
