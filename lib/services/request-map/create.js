import ConflictError from '../../errors/api/conflict'
import BadRequestError from '../../errors/api/bad-request'
import RequestMapModel from '../../models/request-map'
import getOneRequestMapByUrlAndConfigAttribute from './get-one-by-url-and-configattribute'
import validateUrlExpression from './validate-url-expression'

export default async (requestMapInfo) => {
  const requestMap = { ...requestMapInfo }
  if (!validateUrlExpression(requestMap.url)) throw new BadRequestError('Invalid url expression')
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
