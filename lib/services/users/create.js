import { v4 as createId } from 'uuid'
import ConflictError from '../../errors/api/conflict'
import UsersModel from '../../models/users'
import getOneById from './get-one-by-id'
import getOneByUsername from './get-one-by-username'
import { resolve as i18n } from '../../i18n'

export default async (userInfo) => {
  const user = { id: createId(), ...userInfo }
  let exists = await getOneById(user.id)
  if (exists)
    throw new ConflictError(
      i18n('An user with id "{{userId}}" already exists', { userId: user.id })
    )
  exists = await getOneByUsername(user.username)
  if (exists)
    throw new ConflictError('An user with username "{{username}}" already exists', {
      username: user.username,
    })
  return UsersModel.create(user)
}
