import Router from '@everestate/serverless-router'
import { HTTP } from '@everestate/serverless-router-aws'
import updateRole from 'boredom-lib/services/roles/update'
import getRequestContext from 'boredom-lib/helpers/api/get-request-contex'
import responseBuilder from 'boredom-lib/helpers/api/response-builder'

const dispatcher = async (event) => {
  const router = new Router([HTTP])
  const requestContext = await getRequestContext(event)
  const { pathParameters, body } = requestContext

  router.http.put(`/roles/:id`, () =>
    updateRole(pathParameters.id, body).then((updatedRole) =>
      responseBuilder.success.ok({ body: updatedRole })
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
