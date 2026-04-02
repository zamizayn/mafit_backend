'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BranchWeeklySlot extends Model {
    static associate(models) {
      BranchWeeklySlot.belongsTo(models.Branch, {
        foreignKey: 'branchId',
        as: 'branch'
      });
    }
  }
  BranchWeeklySlot.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dayOfWeek: {
      type: DataTypes.INTEGER, // 0-6
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
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'BranchWeeklySlot',
    tableName: 'branch_weekly_slots'
  });
  return BranchWeeklySlot;
};
