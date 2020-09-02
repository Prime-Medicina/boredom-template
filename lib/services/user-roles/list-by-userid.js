import UserRolesModel from '../../models/user-roles'

export default (userId, { lastKey, limit = 10 } = {}) =>
  UserRolesModel.query('userId').eq(userId).startAt(lastKey).limit(limit).exec()
