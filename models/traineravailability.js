'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrainerAvailability extends Model {
    static associate(models) {
      TrainerAvailability.belongsTo(models.Trainer, {
        foreignKey: 'trainerId',
        as: 'trainer'
      });
    }
  }
  TrainerAvailability.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    trainerId: {
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
    }
  }, {
    sequelize,
    modelName: 'TrainerAvailability',
    tableName: 'trainer_availabilities'
  });
  return TrainerAvailability;
};
