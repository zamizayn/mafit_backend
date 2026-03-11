'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    static associate(models) {
      Slot.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility'
      });
      Slot.belongsTo(models.User, {
        foreignKey: 'trainerId',
        as: 'trainer'
      });
      Slot.hasMany(models.Booking, {
        foreignKey: 'slotId',
        as: 'bookings'
      });
    }
  }
  Slot.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    trainerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    capacityLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isRecurring: {
      type: DataTypes.ENUM('none', 'daily', 'weekly'),
      defaultValue: 'none'
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Slot',
    tableName: 'slots'
  });
  return Slot;
};