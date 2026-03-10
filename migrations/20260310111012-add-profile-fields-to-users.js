'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'height', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.addColumn('users', 'goal', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'age');
    await queryInterface.removeColumn('users', 'height');
    await queryInterface.removeColumn('users', 'weight');
    await queryInterface.removeColumn('users', 'goal');
  }
};
