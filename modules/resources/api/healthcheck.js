import responseBuilder from 'boredom-lib/helpers/api/response-builder'
import { name as pkgName, version as pkgVersion } from '../../../package.json'

/**
 * @api {get} / Health check
 * @apiName HealthCheck
 * @apiGroup Health
 *
 * @apiSuccess {String} message Project name and version.
 */
export const handler = async () => {
  try {
    return responseBuilder.success.ok({
      body: {
        message: `${pkgName}: ${pkgVersion}`,
      },
    })
  } catch (err) {
    return responseBuilder.genericError(err)
  }
}
