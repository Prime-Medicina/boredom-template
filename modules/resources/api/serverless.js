/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'resources-api',
  plugins: [
    'serverless-bundle',
    // 'serverless-domain-manager',
  ],
  custom: {
    // customDomain: {
    //   domainName: 'mydomain.name',
    //   basePath: '${self:provider.stage}',
    //   stage: '${self:provider.stage}',
    //   certificateName: '*.mydomain.name',
    //   createRoute53Record: true,
    // },
  },
  provider: {
    runtime: 'nodejs12.x',
    memorySize: 128,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['logs:*'],
        Resource: '*',
      },
    ],
  },
  functions: {
    healthcheck: {
      handler: 'healthcheck.handler',
      events: [
        {
          http: {
            method: 'get',
            path: '/',
            cors: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseDefault5XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_5XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
    },
    Outputs: {
      ApiId: {
        Description: 'API Gateway ID',
        Value: {
          Ref: 'ApiGatewayRestApi',
        },
        Export: {
          Name: '${self:custom.stage}-api-id',
        },
      },
      ApiRootResourceId: {
        Description: 'API Gateway Resource ID',
        Value: {
          'Fn::GetAtt': ['ApiGatewayRestApi', 'RootResourceId'],
        },
        Export: {
          Name: '${self:custom.stage}-api-root-resource-id',
        },
      },
    },
  },
})
