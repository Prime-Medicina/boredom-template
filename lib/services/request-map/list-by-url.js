import RequestMapModel from '../../models/request-map'

export default (url, beginsWith = false, { lastKey, limit = 10 } = {}) => {
  let query = RequestMapModel.query('url')
  if (beginsWith) {
    query = query.filter('url').beginsWith(url)
  } else {
    query = query.eq(url)
  }
  return query.startAt(lastKey).limit(limit).exec()
}
