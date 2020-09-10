/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'api-authorizers',
  plugins: ['serverless-bundle'],
  package: { individually: true },
  custom: {
    usersTableName: '${self:app}-${self:provider.stage}-users-table',
    rolesTableName: '${self:app}-${self:provider.stage}-roles-table',
    userRolesTableName: '${self:app}-${self:provider.stage}-user-roles-table',
    requestMapTableName: '${self:app}-${self:provider.stage}-request-map-table',
  },
  provider: {
    runtime: 'nodejs12.x',
    memorySize: 128,
    timeout: '',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['logs:*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: [
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-users-*',
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-roles-*',
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-user-roles-*',
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-request-map-*',
        ],
      },
    ],
    environment: {
      USERS_TABLE_NAME: '${self:custom.usersTableName}',
      ROLES_TABLE_NAME: '${self:custom.rolesTableName}',
      USER_ROLES_TABLE_NAME: '${self:custom.userRolesTableName}',
      REQUEST_MAP_TABLE_NAME: '${self:custom.requestMapTableName}',
    },
  },
  functions: {
    authorizer: {
      handler: 'index.handler',
    },
  },
  resources: {
    Outputs: {
      authorizerArn: {
        Description: 'Authorizer ARN',
        Value: {
          'Fn::GetAtt': ['AuthorizerLambdaFunction', 'Arn'],
        },
        Export: {
          Name: '${self:custom.stage}-authorizer-arn',
        },
      },
    },
  },
})
