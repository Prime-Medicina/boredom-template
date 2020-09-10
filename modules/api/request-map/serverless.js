/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

const authorizer = {
  name: 'request-map-authorizer',
  arn: {
    'Fn::ImportValue': '${self:custom.stage}-authorizer-arn',
  },
}

module.exports = merge(common, {
  service: 'api-request-map',
  plugins: ['serverless-bundle'],
  package: { individually: true },
  custom: {
    requestMapTableName: '${self:app}-${self:provider.stage}-request-map-table',
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
          'arn:aws:dynamodb:${self:custom.region}:*:table/${self:app}-${self:custom.stage}-request-map-*',
      },
    ],
    environment: {
      REQUEST_MAP_TABLE_NAME: '${self:custom.requestMapTableName}',
    },
  },
  functions: {
    get: {
      handler: 'get.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/request-map',
            cors: true,
            authorizer,
          },
        },
        {
          http: {
            method: 'get',
            path: '/request-map/{url}',
            cors: true,
            authorizer,
          },
        },
        {
          http: {
            method: 'get',
            path: '/request-map/{url}/{configAttribute}',
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
            path: '/request-map',
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
            path: '/request-map/{url}/{configAttribute}',
            cors: true,
            authorizer,
          },
        },
      ],
    },
  },
})
