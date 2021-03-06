import Router from '@everestate/serverless-router'
import { HTTP } from '@everestate/serverless-router-aws'
import listUsers from 'boredom-lib/services/users/list'
import getOneUserById from 'boredom-lib/services/users/get-one-by-id'
import getOneUserByUsername from 'boredom-lib/services/users/get-one-by-username'
import getRequestContext from 'boredom-lib/helpers/api/get-request-contex'
import responseBuilder from 'boredom-lib/helpers/api/response-builder'

const dispatcher = async (event) => {
  const router = new Router([HTTP])
  const requestContext = await getRequestContext(event)
  const { pathParameters, queryStringParameters } = requestContext
  const { limit, lastKey: lastKeyRaw } = queryStringParameters
  const lastKey = lastKeyRaw ? JSON.parse(Buffer.from(lastKeyRaw, 'base64').toString()) : undefined

  router.http.get(`/users`, () =>
    listUsers({ lastKey, limit }).then((page) => responseBuilder.success.ok({ body: page }))
  )

  router.http.get(`/users/id/:id`, () =>
    getOneUserById(pathParameters.id).then((user) =>
      user
        ? responseBuilder.success.ok({ body: user })
        : responseBuilder.errors.notFound('User not found')
    )
  )

  router.http.get(`/users/username/:username`, () =>
    getOneUserByUsername(pathParameters.username).then((user) =>
      user
        ? responseBuilder.success.ok({ body: user })
        : responseBuilder.errors.notFound('User not found')
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
