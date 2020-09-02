/* eslint-disable no-process-env */
const {
  APP_NAME = 'boredom-template',
  SERVICE_NAME = '',
  STAGE = 'development',
  REGION = 'us-east-1',
  USERS_TABLE_NAME = `${APP_NAME}-${STAGE}-users-table`,
  ROLES_TABLE_NAME = `${APP_NAME}-${STAGE}-roles-table`,
  USER_ROLES_TABLE_NAME = `${APP_NAME}-${STAGE}-user-roles-table`,
} = process.env

export default {
  APP_NAME,
  SERVICE_NAME,
  STAGE,
  REGION,
  USERS_TABLE_NAME,
  ROLES_TABLE_NAME,
  USER_ROLES_TABLE_NAME,
}
