/* eslint-disable import/no-commonjs */
const { name: rootPackageName } = require('../package.json')

module.exports = {
  org: 'rodrigogs',
  app: rootPackageName,
  custom: {
    stage: "${opt:stage, env:STAGE, env:NODE_ENV, 'development'}",
    region: "${opt:region, env:AWS_DEFAULT_REGION, 'us-east-1'}",
  },
  provider: {
    name: 'aws',
    profile: 'boredom',
    stage: '${self:custom.stage}',
    region: '${self:custom.region}',
    deploymentBucket: {
      name: '${self:app}-deploys',
      maxPreviousDeploymentArtifacts: 10,
      blockPublicAccess: true,
    },
    environment: {
      APP_NAME: '${self:app}',
      SERVICE_NAME: '${self:service}',
      STAGE: '${self:custom.stage}',
      REGION: '${self:custom.region}',
    },
  },
}
