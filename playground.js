const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

(async () => {
  const result = await dynamoDB.query({
    TableName: 'juriscloud-development-session',
    IndexName: 'userIdActive',
    KeyConditionExpression: '#userId = :userId AND #active = :active',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#active': 'active',
    },
    ExpressionAttributeValues: {
      ':userId': 'ef7db151-52f5-40d9-b2db-d2ec0681e6aa',
      ':active': 0,
    },
  }).promise();
  console.log(result);
})();
