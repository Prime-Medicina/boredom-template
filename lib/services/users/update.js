import NotFoundError from '../../errors/api/not-found'
import UsersModel from '../../models/users'
import getOneById from './get-one-by-id'

export default async (id, updatedInfo) => {
  const currentDoc = await getOneById(id)
  if (!currentDoc) throw new NotFoundError(`User not found for id "${id}"`)
  delete updatedInfo.username
  return UsersModel.update({ id }, updatedInfo)
}
