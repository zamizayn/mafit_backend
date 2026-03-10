'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {

    const now = new Date();

    const password = await bcrypt.hash('Admin@123', 10);

    await queryInterface.bulkInsert('users', [

      {
        id: uuidv4(),
        name: 'Super Admin',
        email: 'admin@mafit.com',
        mobile: '9999999999',
        password: password,
        isActive: true,
        isVerified: true,
        createdAt: now,
        updatedAt: now
      }

    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};