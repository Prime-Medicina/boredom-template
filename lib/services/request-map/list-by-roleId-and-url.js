import RequestMapModel from '../../models/request-map'

export default (roleId, url, { lastKey, limit = 10 } = {}) =>
  RequestMapModel.query('roleId')
    .eq(roleId)
    .where('url')
    .beginsWith(url)
    .startAt(lastKey)
    .limit(limit)
    .exec()
