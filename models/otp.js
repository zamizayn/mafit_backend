module.exports = (sequelize, DataTypes) => {

    const Otp = sequelize.define('Otp', {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        otp: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM('verification', 'login', 'password_reset'),
            allowNull: false,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        isUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        tableName: 'otps'
    })

    Otp.associate = (models) => {

        Otp.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        })

    }

    return Otp
}
