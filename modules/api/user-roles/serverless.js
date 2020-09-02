/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'api-user-roles',
  plugins: ['serverless-bundle'],
  package: { individually: true },
  custom: {
    rolesTableName: '${self:app}-${self:provider.stage}-roles-table',
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
      ROLES_TABLE_NAME: '${self:custom.rolesTableName}',
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
          },
        },
        {
          http: {
            method: 'get',
            path: '/user-roles/{userId}',
            cors: true,
          },
        },
        {
          http: {
            method: 'get',
            path: '/user-roles/{userId}/{roleId}',
            cors: true,
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
          },
        },
      ],
    },
  },
})
