module.exports = (sequelize, DataTypes) => {

  const Role = sequelize.define('Role', {

    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    name: DataTypes.STRING,

    description: DataTypes.STRING

  }, {
    tableName: 'roles'
  })

  Role.associate = (models) => {

    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId'
    })

  }

  return Role
}