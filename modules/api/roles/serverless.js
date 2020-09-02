/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'api-roles',
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
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-roles-*',
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
            path: '/roles',
            cors: true,
          },
        },
        {
          http: {
            method: 'get',
            path: '/roles/{id}',
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
            path: '/roles',
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
            path: '/roles/{id}',
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
            path: '/roles/{id}',
            cors: true,
          },
        },
      ],
    },
  },
})
