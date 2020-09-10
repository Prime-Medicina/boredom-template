import Router from '@everestate/serverless-router'
import { HTTP } from '@everestate/serverless-router-aws'
import listRoles from 'boredom-lib/services/roles/list'
import getOneRoleById from 'boredom-lib/services/roles/get-one-by-id'
import getRequestContext from 'boredom-lib/helpers/api/get-request-contex'
import responseBuilder from 'boredom-lib/helpers/api/response-builder'

const dispatcher = async (event) => {
  const router = new Router([HTTP])
  const requestContext = await getRequestContext(event)
  const { pathParameters, queryStringParameters } = requestContext
  const { limit, lastKey: lastKeyRaw } = queryStringParameters
  const lastKey = lastKeyRaw ? JSON.parse(Buffer.from(lastKeyRaw, 'base64').toString()) : undefined

  router.http.get(`/roles`, () =>
    listRoles({ lastKey, limit }).then((page) => responseBuilder.success.ok({ body: page }))
  )

  router.http.get(`/roles/:id`, () =>
    getOneRoleById(pathParameters.id).then((role) =>
      role
        ? responseBuilder.success.ok({ body: role })
        : responseBuilder.errors.notFound('Role not found')
    )
  )

  router.mismatch(() => {
    const { path, httpMethod } = event
    return Promise.reject(new Error(`Unknown route: ${httpMethod} ${path}`))
  })

  return router.dispatch(event)
}

export const handler = async (event) => {
  try {
    return await dispatcher(event)
  } catch (err) {
    console.error(err)
    return responseBuilder.genericError(err)
  }
}
