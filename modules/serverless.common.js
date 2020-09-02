// eslint-disable-next-line import/no-commonjs
module.exports = {
  org: 'rodrigogs',
  app: 'boredom-template',
  custom: {
    stage: "${opt:stage, env:STAGE, env:NODE_ENV, 'development'}",
    region: "${opt:region, env:REGION, 'us-east-1'}",
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
