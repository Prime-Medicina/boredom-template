/* eslint-disable no-process-env */
const {
  APP_NAME = 'boredom-template',
  SERVICE_NAME = '',
  STAGE = 'development',
  REGION = 'us-east-1',
  LANGUAGE = 'en',
  USERS_TABLE_NAME = `${APP_NAME}-${STAGE}-users-table`,
  ROLES_TABLE_NAME = `${APP_NAME}-${STAGE}-roles-table`,
  USER_ROLES_TABLE_NAME = `${APP_NAME}-${STAGE}-user-roles-table`,
  REQUEST_MAP_TABLE_NAME = `${APP_NAME}-${STAGE}-request-map-table`,
} = process.env

export default {
  APP_NAME,
  SERVICE_NAME,
  STAGE,
  REGION,
  LANGUAGE,
  USERS_TABLE_NAME,
  ROLES_TABLE_NAME,
  USER_ROLES_TABLE_NAME,
  REQUEST_MAP_TABLE_NAME,
}
