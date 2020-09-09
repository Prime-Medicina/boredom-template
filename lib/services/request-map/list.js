import RequestMapModel from '../../models/request-map'

export default async ({ lastKey, limit = 10 } = {}) => {
  const data = await RequestMapModel.scan().startAt(lastKey).limit(limit).exec()
  return {
    data,
    lastKey: data.lastKey
      ? Buffer.from(JSON.stringify(data.lastKey)).toString('base64')
      : undefined,
  }
}
