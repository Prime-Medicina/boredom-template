import UserRolesModel from '../../models/user-roles'

export default async ({ lastKey, limit = 10 } = {}) => {
  const data = await UserRolesModel.scan().startAt(lastKey).limit(limit).exec()
  return {
    data,
    lastKey: data.lastKey
      ? Buffer.from(JSON.stringify(data.lastKey)).toString('base64')
      : undefined,
  }
}
