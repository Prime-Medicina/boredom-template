module.exports = (user, key, methodArn) => ({
  principalId: key,
  policyDocument: {
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: methodArn,
    }],
    Version: '2012-10-17',
  },
  context: { consumer: JSON.stringify(user) },
});
