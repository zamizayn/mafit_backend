'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {

    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='admin@mafit.com';`
    );

    const roles = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name='Admin';`
    );

    const userId = users[0][0].id;
    const roleId = roles[0][0].id;

    const now = new Date();

    await queryInterface.bulkInsert('user_roles', [

      {
        id: uuidv4(),
        userId: userId,
        roleId: roleId,
        createdAt: now,
        updatedAt: now
      }

    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};