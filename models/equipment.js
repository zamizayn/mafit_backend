'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Equipment.belongsTo(models.Branch, {
        foreignKey: 'branchId',
        as: 'branch'
      });
    }
  }
  Equipment.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: DataTypes.STRING,
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    primaryPhoto: DataTypes.STRING,
    brand: DataTypes.STRING,
    modelNumber: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    purchaseDate: DataTypes.DATEONLY,
    warrantyExpiry: DataTypes.DATEONLY,
    purchaseCost: DataTypes.DECIMAL(10, 2),
    assignedArea: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Active'
    },
    maintenanceFrequency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Equipment',
    tableName: 'equipment'
  });
  return Equipment;
};