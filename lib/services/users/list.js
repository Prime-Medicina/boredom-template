import UsersModel from '../../models/users'

export default ({ lastKey, limit = 10 } = {}) =>
  UsersModel.scan().startAt(lastKey).limit(limit).exec()
