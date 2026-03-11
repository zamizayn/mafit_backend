'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FacilityOperatingHours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FacilityOperatingHours.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility'
      });
    }
  }
  FacilityOperatingHours.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dayRange: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    closeTime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'FacilityOperatingHours',
    tableName: 'facility_operating_hours'
  });
  return FacilityOperatingHours;
};