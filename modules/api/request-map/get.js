import Router from '@everestate/serverless-router'
import { HTTP } from '@everestate/serverless-router-aws'
import listRequestMap from 'boredom-lib/services/request-map/list'
import listRequestMapByUrl from 'boredom-lib/services/request-map/list-by-url'
import getOneRequestMapByUrlAndConfigAttribute from 'boredom-lib/services/request-map/get-one-by-url-and-configattribute'
import getRequestContext from 'boredom-lib/helpers/api/get-request-contex'
import responseBuilder from 'boredom-lib/helpers/api/response-builder'

const dispatcher = async (event) => {
  const router = new Router([HTTP])
  const {
    pathParameters: { url, configAttribute },
    queryStringParameters: { lastKey: lastKeyRaw, limit },
  } = await getRequestContext(event)
  const lastKey = lastKeyRaw ? JSON.parse(Buffer.from(lastKeyRaw, 'base64').toString()) : undefined

  router.http.get(`/request-map`, () =>
    listRequestMap({ lastKey, limit }).then((page) => responseBuilder.success.ok({ body: page }))
  )

  router.http.get(`/request-map/:url`, () =>
    listRequestMapByUrl(url, {
      lastKey,
      limit,
    }).then((requestMap) => responseBuilder.success.ok({ body: requestMap }))
  )

  router.http.get(`/request-map/:url/:configAttribute`, () =>
    getOneRequestMapByUrlAndConfigAttribute(url, configAttribute, {
      lastKey,
      limit,
    }).then((requestMap) =>
      requestMap
        ? responseBuilder.success.ok({ body: requestMap })
        : responseBuilder.errors.notFound('Request map not found')
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
