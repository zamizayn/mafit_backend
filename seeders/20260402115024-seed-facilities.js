'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('facilities', [
      {
        id: uuidv4(),
        name: 'Gym',
        description: 'Fully equipped modern gym with cardio and strength training sections.',
        image: 'gym-image-url.jpg',
        maxCapacity: 50,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Swimming',
        description: 'Temperature controlled Olympic size swimming pool.',
        image: 'swimming-pool-image-url.jpg',
        maxCapacity: 30,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Yoga',
        description: 'Serene yoga studio for mindfulness and flexibility sessions.',
        image: 'yoga-studio-image-url.jpg',
        maxCapacity: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Badminton',
        description: 'Professional indoor badminton courts with synthetic flooring.',
        image: 'badminton-court-image-url.jpg',
        maxCapacity: 16,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('facilities', null, {});
  }
};
