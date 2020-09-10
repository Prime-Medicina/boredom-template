/* eslint-disable import/no-commonjs, import/no-commonjs */
const merge = require('lodash.merge')
const common = require('../../serverless.common')

module.exports = merge(common, {
  service: 'resources-web',
  plugins: ['serverless-finch', 'serverless-scriptable-plugin'],
  custom: {
    client: {
      bucketName: '${self:app}-${self:provider.stage}-webapp',
      distributionFolder: 'build'
    },
    scriptHooks: {
      'after:package:createDeploymentArtifacts': [
        'npm run predeploy',
        'npm run deploy',
        'sls client deploy --no-confirm',
      ],
    },
  },
  resources: {
    Resources: {
      S3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:custom.client.bucketName}',
        },
      },
    },
  },
})
