'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const facilityId = uuidv4();
    const trainerId = uuidv4();

    // 1. Create a Facility
    await queryInterface.bulkInsert('facilities', [{
      id: facilityId,
      name: 'Main Gym Floor',
      description: 'The primary cardiovascular and strength training zone.',
      image: 'https://example.com/facility.jpg',
      maxCapacity: 50,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }]);

    // 2. Create a Trainer User (and get/ensure role)
    const [trainerRole] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE name = 'Trainer' LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (trainerRole) {
        await queryInterface.bulkInsert('users', [{
            id: trainerId,
            name: "Marco 'The Beast' Rossi",
            email: 'marco@gym.com',
            mobile: '1234567890',
            password: 'hashed_password', // placeholder
            isActive: true,
            isVerified: true,
            createdAt: now,
            updatedAt: now
        }]);

        await queryInterface.bulkInsert('userRoles', [{
            userId: trainerId,
            roleId: trainerRole.id,
            createdAt: now,
            updatedAt: now
        }]);
    }

    // 3. Create some Slots
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await queryInterface.bulkInsert('slots', [
      {
        id: uuidv4(),
        facilityId: facilityId,
        trainerId: trainerId,
        date: dateStr,
        startTime: '09:00:00',
        endTime: '10:30:00',
        capacityLimit: 20,
        isRecurring: 'none',
        isVisible: true,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        facilityId: facilityId,
        trainerId: trainerId,
        date: dateStr,
        startTime: '10:30:00',
        endTime: '12:00:00',
        capacityLimit: 20,
        isRecurring: 'none',
        isVisible: true,
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('slots', null, {});
    await queryInterface.bulkDelete('facilities', null, {});
    // Note: Not deleting users/roles to avoid cascade issues in test
  }
};
