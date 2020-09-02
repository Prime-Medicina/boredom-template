import RequestMapModel from '../../models/request-map'

export default ({ lastKey, limit = 10 } = {}) =>
  RequestMapModel.scan().startAt(lastKey).limit(limit).exec()
