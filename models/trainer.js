'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trainer extends Model {
    static associate(models) {
      Trainer.belongsTo(models.Branch, {
        foreignKey: 'branchId',
        as: 'branch'
      });
      Trainer.hasMany(models.TrainerAvailability, {
        foreignKey: 'trainerId',
        as: 'availabilities'
      });
    }
  }
  Trainer.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Trainer',
    tableName: 'trainers'
  });
  return Trainer;
};
