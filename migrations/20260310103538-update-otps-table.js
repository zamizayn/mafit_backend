'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Delete existing OTPs
    await queryInterface.bulkDelete('otps', null, {});

    // 2. Add mobile column
    await queryInterface.addColumn('otps', 'mobile', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // 3. Make userId nullable using raw SQL for reliability in Postgres
    await queryInterface.sequelize.query('ALTER TABLE "otps" ALTER COLUMN "userId" DROP NOT NULL;');
  },

  async down(queryInterface, Sequelize) {
    // 1. Remove mobile column
    await queryInterface.removeColumn('otps', 'mobile');

    // 2. Make userId not nullable
    await queryInterface.sequelize.query('ALTER TABLE "otps" ALTER COLUMN "userId" SET NOT NULL;');
  }
};
