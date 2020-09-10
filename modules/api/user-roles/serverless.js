/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

const authorizer = {
  name: 'user-roles-authorizer',
  arn: {
    'Fn::ImportValue': '${self:custom.stage}-authorizer-arn',
  },
}

module.exports = merge(common, {
  service: 'api-user-roles',
  plugins: ['serverless-bundle'],
  package: { individually: true },
  custom: {
    usersTableName: '${self:app}-${self:provider.stage}-users-table',
    rolesTableName: '${self:app}-${self:provider.stage}-roles-table',
    userRolesTableName: '${self:app}-${self:provider.stage}-user-roles-table',
  },
  provider: {
    runtime: 'nodejs12.x',
    memorySize: 128,
    apiGateway: {
      restApiId: {
        'Fn::ImportValue': '${self:custom.stage}-api-id',
      },
      restApiRootResourceId: {
        'Fn::ImportValue': '${self:custom.stage}-api-root-resource-id',
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['logs:*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource:
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-user-roles-*',
      },
      {
        Effect: 'Allow',
        Action: ['dynamodb:GetItem'],
        Resource: [
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-users-*',
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-roles-*',
        ],
      },
    ],
    environment: {
      USERS_TABLE_NAME: '${self:custom.usersTableName}',
      ROLES_TABLE_NAME: '${self:custom.rolesTableName}',
      USER_ROLES_TABLE_NAME: '${self:custom.userRolesTableName}',
    },
  },
  functions: {
    get: {
      handler: 'get.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/user-roles',
            cors: true,
            authorizer,
          },
        },
        {
          http: {
            method: 'get',
            path: '/user-roles/{userId}',
            cors: true,
            authorizer,
          },
        },
        {
          http: {
            method: 'get',
            path: '/user-roles/{userId}/{roleId}',
            cors: true,
            authorizer,
          },
        },
      ],
    },
    post: {
      handler: 'post.handler',
      events: [
        {
          http: {
            method: 'post',
            path: '/user-roles',
            cors: true,
            authorizer,
          },
        },
      ],
    },
    delete: {
      handler: 'delete.handler',
      events: [
        {
          http: {
            method: 'delete',
            path: '/user-roles/{userId}/{roleId}',
            cors: true,
            authorizer,
          },
        },
      ],
    },
  },
})
