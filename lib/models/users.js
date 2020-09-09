import dynamoose from 'dynamoose'
import config from '../config'

const schema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    username: {
      type: String,
      index: {
        name: 'username-index',
        global: true,
      },
      validate: (val) => val && val.length >= 3 && val.length <= 100,
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  }
)

export default dynamoose.model(config.USERS_TABLE_NAME, schema, {
  create: false,
  waitForActive: false,
})
