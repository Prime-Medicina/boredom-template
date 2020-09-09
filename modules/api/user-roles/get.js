import Router from '@everestate/serverless-router'
import { HTTP } from '@everestate/serverless-router-aws'
import listUserRoles from 'boredom-lib/services/user-roles/list'
import listUserRolesByUserId from 'boredom-lib/services/user-roles/list-by-userid'
import getOneUserRoleByUserIdAndRoleId from 'boredom-lib/services/user-roles/get-one-by-usedid-and-roleid'
import getRequestContext from 'boredom-lib/helpers/api/get-request-contex'
import responseBuilder from 'boredom-lib/helpers/api/response-builder'

const dispatcher = async (event) => {
  const router = new Router([HTTP])
  const requestContext = await getRequestContext(event)
  const { pathParameters, queryStringParameters } = requestContext
  const { limit, lastKey: lastKeyRaw } = queryStringParameters
  const lastKey = lastKeyRaw ? JSON.parse(Buffer.from(lastKeyRaw, 'base64').toString()) : undefined

  router.http.get(`/user-roles`, () =>
    listUserRoles({ lastKey, limit }).then((page) => responseBuilder.success.ok({ body: page }))
  )

  router.http.get(`/user-roles/:userId`, () =>
    listUserRolesByUserId(pathParameters.userId, { lastKey, limit }).then((page) =>
      responseBuilder.success.ok({ body: page })
    )
  )

  router.http.get(`/user-roles/:userId/:roleId`, () =>
    getOneUserRoleByUserIdAndRoleId(pathParameters.userId, pathParameters.roleId).then((userRole) =>
      userRole
        ? responseBuilder.success.ok({ body: userRole })
        : responseBuilder.error.notFound('User role not found')
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
