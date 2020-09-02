import dynamoose from 'dynamoose'
import config from '../config'

const schema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    description: {
      type: String,
      required: true,
      validate: (val) => val && val.length > 1 && val.length < 300,
    },
    roleId: {
      type: String,
      index: {
        name: 'roleId-url-index',
        hashKey: true,
        global: true,
      },
    },
    url: {
      type: String,
      required: true,
      index: {
        name: 'roleId-url-index',
        rangeKey: true,
        global: true,
      },
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
