'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = await queryInterface.sequelize.query(
      `SELECT name FROM roles WHERE name IN ('Trainer', 'Member')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const existingRoleNames = roles.map(r => r.name);
    const rolesToInsert = [];
    const now = new Date();

    if (!existingRoleNames.includes('Trainer')) {
      rolesToInsert.push({
        id: uuidv4(),
        name: 'Trainer',
        description: 'Gym Trainer',
        createdAt: now,
        updatedAt: now
      });
    }

    if (!existingRoleNames.includes('Member')) {
      rolesToInsert.push({
        id: uuidv4(),
        name: 'Member',
        description: 'Gym Member',
        createdAt: now,
        updatedAt: now
      });
    }

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('roles', rolesToInsert);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      name: ['Trainer', 'Member']
    });
  }
};
