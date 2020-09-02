import dynamoose from 'dynamoose'
import config from '../config'

const schema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    name: {
      type: String,
      required: true,
      validate: (val) => val && val.length > 1 && val.length < 30,
    },
    description: {
      type: String,
      required: false,
      validate: (val) => val && val.length > 1 && val.length < 300,
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  }
)

export default dynamoose.model(config.ROLES_TABLE_NAME, schema, {
  create: false,
  waitForActive: false,
})
