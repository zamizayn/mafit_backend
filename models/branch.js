'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {
      Branch.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'category'
      });
      Branch.hasMany(models.BranchWeeklySlot, {
        foreignKey: 'branchId',
        as: 'weeklySlots'
      });
      Branch.hasMany(models.Slot, {
        foreignKey: 'branchId',
        as: 'slots'
      });
      Branch.hasMany(models.Equipment, {
        foreignKey: 'branchId',
        as: 'equipment'
      });
      Branch.hasMany(models.FacilityOperatingHours, {
        foreignKey: 'branchId',
        as: 'operatingHours'
      });
      Branch.hasMany(models.Trainer, {
        foreignKey: 'branchId',
        as: 'trainers'
      });
    }
  }
  Branch.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    maxCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Branch',
    tableName: 'branches'
  });
  return Branch;
};
