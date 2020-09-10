import RequestMapModel from '../../models/request-map'

export default async (url, { lastKey, limit = 10 } = {}) => {
  const decodedUrl = decodeURI(url)
  const data = await RequestMapModel.query('url')
    .eq(decodedUrl)
    .startAt(lastKey)
    .limit(limit)
    .exec()
  return {
    data,
    lastKey: data.lastKey
      ? Buffer.from(JSON.stringify(data.lastKey)).toString('base64')
      : undefined,
  }
}
