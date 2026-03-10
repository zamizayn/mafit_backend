'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {

    const now = new Date();

    await queryInterface.bulkInsert('roles', [

      {
        id: uuidv4(),
        name: 'Admin',
        description: 'System administrator',
        createdAt: now,
        updatedAt: now
      },

      {
        id: uuidv4(),
        name: 'Customer',
        description: 'App customer',
        createdAt: now,
        updatedAt: now
      }

    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};