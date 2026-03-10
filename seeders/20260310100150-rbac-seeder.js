'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const roles = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Admin';`
    );

    const permissions = await queryInterface.sequelize.query(
      `SELECT id FROM permissions;`
    );

    const adminRoleId = roles[0][0].id;

    const rolePermissions = permissions[0].map(p => ({
      id: Sequelize.literal('gen_random_uuid()'),
      roleId: adminRoleId,
      permissionId: p.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('role_permissions', rolePermissions);

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('role_permissions', null, {});

  }
};