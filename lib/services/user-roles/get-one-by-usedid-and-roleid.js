import UserRolesModel from '../../models/user-roles'

export default (userId, roleId) => UserRolesModel.get({ userId, roleId })
