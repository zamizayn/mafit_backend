'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {

    const now = new Date();

    await queryInterface.bulkInsert('permissions', [

      {
        id: uuidv4(),
        name: 'manage_users',
        module: 'users',
        createdAt: now,
        updatedAt: now
      },

      {
        id: uuidv4(),
        name: 'manage_roles',
        module: 'roles',
        createdAt: now,
        updatedAt: now
      },

      {
        id: uuidv4(),
        name: 'manage_permissions',
        module: 'roles',
        createdAt: now,
        updatedAt: now
      },

      {
        id: uuidv4(),
        name: 'manage_facilities',
        module: 'facilities',
        createdAt: now,
        updatedAt: now
      },

      {
        id: uuidv4(),
        name: 'manage_slots',
        module: 'slots',
        createdAt: now,
        updatedAt: now
      },

      {
        id: uuidv4(),
        name: 'view_reports',
        module: 'reports',
        createdAt: now,
        updatedAt: now
      }

    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};