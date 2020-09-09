/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'api-users',
  plugins: ['serverless-bundle'],
  package: { individually: true },
  custom: {
    usersTableName: '${self:app}-${self:provider.stage}-users-table',
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
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-users-*',
      },
    ],
    environment: {
      USERS_TABLE_NAME: '${self:custom.usersTableName}',
    },
  },
  functions: {
    get: {
      handler: 'get.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/users',
            cors: true,
          },
        },
        {
          http: {
            method: 'get',
            path: '/users/id/{id}',
            cors: true,
          },
        },
        {
          http: {
            method: 'get',
            path: '/users/username/{username}',
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
            path: '/users',
            cors: true,
          },
        },
      ],
    },
    put: {
      handler: 'put.handler',
      events: [
        {
          http: {
            method: 'put',
            path: '/users/{id}',
            cors: true,
            authorizer: {
              'Fn::ImportValue': '${self:custom.stage}-api-root-resource-id',
            },
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
            path: '/users/{id}',
            cors: true,
          },
        },
      ],
    },
  },
})
