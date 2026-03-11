'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Facility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Facility.hasMany(models.FacilityOperatingHours, {
        foreignKey: 'facilityId',
        as: 'operatingHours'
      });
      Facility.hasMany(models.Equipment, {
        foreignKey: 'facilityId',
        as: 'equipment'
      });
    }
  }
  Facility.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
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
    modelName: 'Facility',
    tableName: 'facilities'
  });
  return Facility;
};