'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'equipment';

    await queryInterface.addColumn(table, 'primaryPhoto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'brand', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'modelNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'serialNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'purchaseDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'warrantyExpiry', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'purchaseCost', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'assignedArea', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(table, 'status', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Active'
    });
    await queryInterface.addColumn(table, 'maintenanceFrequency', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const table = 'equipment';

    await queryInterface.removeColumn(table, 'primaryPhoto');
    await queryInterface.removeColumn(table, 'brand');
    await queryInterface.removeColumn(table, 'modelNumber');
    await queryInterface.removeColumn(table, 'serialNumber');
    await queryInterface.removeColumn(table, 'purchaseDate');
    await queryInterface.removeColumn(table, 'warrantyExpiry');
    await queryInterface.removeColumn(table, 'purchaseCost');
    await queryInterface.removeColumn(table, 'assignedArea');
    await queryInterface.removeColumn(table, 'status');
    await queryInterface.removeColumn(table, 'maintenanceFrequency');
  }
};
