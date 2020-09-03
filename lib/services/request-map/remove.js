import RequestMapModel from '../../models/request-map'

export default (url, configAttribute) => RequestMapModel.delete({ url, configAttribute })
