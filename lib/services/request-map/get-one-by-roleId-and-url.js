import RequestMapModel from '../../models/request-map'

export default (roleId, url) => RequestMapModel.get({ roleId, url })
