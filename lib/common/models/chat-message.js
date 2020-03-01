const wrapMessage = ({
  type = 'message',
  content,
  mask,
  from,
  timestamp = Date.now(),
  delivered = false,
  failed = false,
}) => {
  if (!from) throw new Error('Missing "from" argument');
  return {
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
