/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'db',
  custom: {
    usersTableName: '${self:app}-${self:provider.stage}-users-table',
    rolesTableName: '${self:app}-${self:provider.stage}-roles-table',
    userRolesTableName: '${self:app}-${self:provider.stage}-user-roles-table',
    requestMapTableName: '${self:app}-${self:provider.stage}-request-map-table',
  },
  resources: {
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.usersTableName}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'username',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
          GlobalSecondaryIndexes: [
            {
              IndexName: 'username',
              KeySchema: [
                {
                  AttributeName: 'username',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
        },
      },
      RolesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.rolesTableName}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
      UserRolesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.userRolesTableName}',
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'roleId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'roleId',
              KeyType: 'RANGE',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
      RequestMapTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.requestMapTableName}',
          AttributeDefinitions: [
            {
              AttributeName: 'roleId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'url',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'roleId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'url',
              KeyType: 'RANGE',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
    },
    Outputs: {
      UsersTableArn: {
        Value: '!GetAtt UsersTable.Arn',
        Export: {
          Name: '${self:custom.stage}-users-table-arn',
        },
      },
      RolesTableArn: {
        Value: '!GetAtt UsersTable.Arn',
        Export: {
          Name: '${self:custom.stage}-roles-table-arn',
        },
      },
      UserRolesTableArn: {
        Value: '!GetAtt UserRolesTable.Arn',
        Export: {
          Name: '${self:custom.stage}-user-roles-table-arn',
        },
      },
      RequestMapTableArn: {
        Value: '!GetAtt RequestMapTable.Arn',
        Export: {
          Name: '${self:custom.stage}-request-map-table-arn',
        },
      },
    },
  },
})
