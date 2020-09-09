import ConflictError from '../../errors/api/conflict'
import RequestMapModel from '../../models/request-map'
import getOneRequestMapByUrlAndConfigAttribute from './get-one-by-url-and-configattribute'

export default async (requestMapInfo) => {
  const requestMap = { ...requestMapInfo }
  const requestMapExists = await getOneRequestMapByUrlAndConfigAttribute(
    requestMap.url,
    requestMap.configAttribute
  )
  if (requestMapExists)
    throw new ConflictError(
      `A request map with url "${requestMap.url}" and configAttribute "${requestMap.configAttribute}" already exists`
    )
  return RequestMapModel.create(requestMap)
}
