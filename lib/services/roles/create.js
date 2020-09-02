import { v4 as createId } from 'uuid'
import ConflictError from '../../errors/api/conflict'
import RolesModel from '../../models/roles'
import getOneById from './get-one-by-id'

export default async (roleInfo) => {
  const role = { id: createId(), ...roleInfo }
  let exists = await getOneById(role.id)
  if (exists) throw new ConflictError(`A role with id "${role.id}" already exists`)
  return RolesModel.create(role)
}
