import dynamoose from 'dynamoose'
import config from '../config'

const schema = new dynamoose.Schema(
  {
    userId: {
      type: String,
      hashKey: true,
    },
    roleId: {
      type: String,
      rangeKey: true,
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  }
)

export default dynamoose.model(config.USER_ROLES_TABLE_NAME, schema, {
  create: false,
  waitForActive: false,
})
