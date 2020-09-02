import ConflictError from '../../errors/api/conflict'
import NotFoundError from '../../errors/api/not-found'
import UserRolesModel from '../../models/user-roles'
import getOneUserById from '../users/get-one-by-id'
import getOneRoleById from '../roles/get-one-by-id'
import getOneByUserIdAndRoleId from './get-one-by-usedid-and-roleid'

export default async (userRoleInfo) => {
  const userRole = { ...userRoleInfo }
  const userRoleExists = await getOneByUserIdAndRoleId(userRole.userId, userRole.roleId)
  if (userRoleExists)
    throw new ConflictError(
      `An user role with user id "${userRole.userId}" and role id "${userRole.roleId}" already exists`
    )
  const userExists = await getOneUserById(userRole.userId)
  if (!userExists) throw new NotFoundError(`User not found for id "${userRole.userId}"`)
  const roleExists = await getOneRoleById(userRole.roleId)
  if (!roleExists) throw new NotFoundError(`Role not found for id "${userRole.roleId}"`)
  return UserRolesModel.create(userRole)
}
