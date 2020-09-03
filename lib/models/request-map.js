import dynamoose from 'dynamoose'
import config from '../config'

const schema = new dynamoose.Schema(
  {
    url: {
      type: String,
      hashKey: true,
      validate: (val) => val && val.length >= 1 && val.length <= 300,
    },
    configAttribute: {
      type: String,
      rangeKey: true,
      validate: (val) => val && val.length >= 1 && val.length <= 300,
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  }
)

export default dynamoose.model(config.REQUEST_MAP_TABLE_NAME, schema, {
  create: false,
  waitForActive: false,
})
