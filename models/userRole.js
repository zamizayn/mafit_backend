module.exports = (sequelize, DataTypes) => {

    const UserRole = sequelize.define('UserRole', {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        userId: DataTypes.UUID,

        roleId: DataTypes.UUID

    }, {
        tableName: 'user_roles'
    })

    return UserRole
}