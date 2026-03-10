module.exports = (sequelize, DataTypes) => {

    const RolePermission = sequelize.define('RolePermission', {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        roleId: DataTypes.UUID,

        permissionId: DataTypes.UUID

    }, {
        tableName: 'role_permissions'
    })

    return RolePermission
}