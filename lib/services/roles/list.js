import RolesModel from '../../models/roles'

export default ({ lastKey, limit = 10 } = {}) =>
  RolesModel.scan().startAt(lastKey).limit(limit).exec()
