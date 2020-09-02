import NotFoundError from '../../errors/api/not-found'
import RolesModel from '../../models/roles'
import getOneById from './get-one-by-id'

export default async (id, updatedInfo) => {
  const currentDoc = await getOneById(id)
  if (!currentDoc) throw new NotFoundError(`Role not found for id "${id}"`)
  return RolesModel.update({ id }, updatedInfo)
}
