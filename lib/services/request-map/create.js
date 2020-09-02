import ConflictError from '../../errors/api/conflict'
import NotFoundError from '../../errors/api/not-found'
import RequestMapModel from '../../models/request-map'
import getOneRoleById from '../roles/get-one-by-id'
import getOneRequestMapByRoleIdAndUrl from './get-one-by-roleId-and-url'

export default async (requestMapInfo) => {
  const requestMap = { ...requestMapInfo }
  const requestMapExists = await getOneRequestMapByRoleIdAndUrl(requestMap.roleId, requestMap.url)
  if (requestMapExists)
    throw new ConflictError(
      `A request map with roleId "${requestMap.roleId}" and url "${requestMap.url}" already exists`
    )
  const roleExists = await getOneRoleById(requestMap.roleId)
  if (!roleExists) throw new NotFoundError(`Role not found for id "${requestMap.roleId}"`)
  return RequestMapModel.create(requestMap)
}
