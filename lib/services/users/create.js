import { v4 as createId } from 'uuid'
import ConflictError from '../../errors/api/conflict'
import UsersModel from '../../models/users'
import getOneById from './get-one-by-id'
import getOneByUsername from './get-one-by-username'

export default async (userInfo) => {
  const user = { id: createId(), ...userInfo }
  let exists = await getOneById(user.id)
  if (exists) throw new ConflictError(`An user with id "${user.id}" already exists`)
  exists = await getOneByUsername(user.username)
  if (exists) throw new ConflictError(`An user with username "${user.username}" already exists`)
  return UsersModel.create(user)
}
