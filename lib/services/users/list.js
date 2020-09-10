import UsersModel from '../../models/users'

export default async ({ lastKey, limit = 10 } = {}) => {
  const data = await UsersModel.scan().startAt(lastKey).limit(limit).exec()
  return {
    data,
    lastKey: data.lastKey
      ? Buffer.from(JSON.stringify(data.lastKey)).toString('base64')
      : undefined,
  }
}
