'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove columns from facilities
    await queryInterface.removeColumn('facilities', 'parentId');
    await queryInterface.removeColumn('facilities', 'location');

    // 2. Create branches table
    await queryInterface.createTable('branches', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      facilityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'facilities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      maxCapacity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 3. Re-create or rename facility_weekly_slots to branch_weekly_slots
    // To be safe, we'll drop the old one and create the new one (renamed correctly)
    await queryInterface.dropTable('facility_weekly_slots');
    
    await queryInterface.createTable('branch_weekly_slots', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      branchId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'branches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dayOfWeek: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      capacityLimit: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 4. Update other tables to point to branchId instead of facilityId
    // For convenience of this restructure, we drop and recreate columns to ensure FK integrity
    await queryInterface.removeColumn('slots', 'facilityId');
    await queryInterface.addColumn('slots', 'branchId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'branches', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Doing the same for equipment and operating hours if they exist
    await queryInterface.removeColumn('equipment', 'facilityId');
    await queryInterface.addColumn('equipment', 'branchId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'branches', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.removeColumn('facility_operating_hours', 'facilityId');
    await queryInterface.addColumn('facility_operating_hours', 'branchId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'branches', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Reversing these would be complex, but for local dev we can just drop the tables
    await queryInterface.dropTable('branch_weekly_slots');
    await queryInterface.dropTable('branches');
    // Add back the columns to facility if needed, but usually we just fix the migration
  }
};
