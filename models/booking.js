'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Slot, {
        foreignKey: 'slotId',
        as: 'slot'
      });
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  Booking.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    slotId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('paid', 'overdue', 'pending'),
      defaultValue: 'pending'
    },
    checkInTime: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'cancelled'),
      defaultValue: 'confirmed'
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings'
  });
  return Booking;
};