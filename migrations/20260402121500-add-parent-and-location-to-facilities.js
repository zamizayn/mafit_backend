'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('facilities', 'parentId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'facilities',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('facilities', 'location', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('facilities', 'parentId');
    await queryInterface.removeColumn('facilities', 'location');
  }
};
