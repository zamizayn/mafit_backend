module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,

        },

        name: DataTypes.STRING,

        email: DataTypes.STRING,

        mobile: DataTypes.STRING,

        password: DataTypes.STRING,

        profileImage: DataTypes.STRING,
        age: DataTypes.INTEGER,
        height: DataTypes.FLOAT,
        weight: DataTypes.FLOAT,
        goal: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,

        isVerified: DataTypes.BOOLEAN

    }, {
        tableName: 'users'
    })

    User.associate = (models) => {

        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: 'userId'
        })

        User.hasMany(models.Otp, {
            foreignKey: 'userId'
        })

    }

    return User
}