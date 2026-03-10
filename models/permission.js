module.exports = (sequelize, DataTypes) => {

    const Permission = sequelize.define('Permission', {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        name: DataTypes.STRING,

        module: DataTypes.STRING

    }, {
        tableName: 'permissions'
    })

    Permission.associate = (models) => {

        Permission.belongsToMany(models.Role, {
            through: models.RolePermission,
            foreignKey: 'permissionId'
        })

    }

    return Permission
}