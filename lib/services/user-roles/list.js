import UserRolesModel from '../../models/user-roles'

export default ({ lastKey, limit = 10 } = {}) =>
  UserRolesModel.scan().startAt(lastKey).limit(limit).exec()
