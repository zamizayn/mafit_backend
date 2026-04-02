const { Trainer, TrainerAvailability, Branch } = require('../../models');

/**
 * @desc    Add a new trainer to a branch
 * @route   POST /api/branches/:branchId/trainers
 * @access  Private/Admin
 */
exports.addTrainer = async (req, res) => {
  try {
    const { branchId } = req.params;
    const {
      fullName,
      email,
      specialization,
      hourlyRate,
      bio,
      photo,
      availability
    } = req.body;

    // Check if branch exists
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    // Create Trainer
    const trainer = await Trainer.create({
      branchId,
      fullName,
      email,
      specialization,
      hourlyRate,
      bio,
      photo
    });

    // Create Availabilities if provided
    if (availability && availability.length > 0) {
      const availabilityData = availability.map(a => ({
        ...a,
        trainerId: trainer.id
      }));
      await TrainerAvailability.bulkCreate(availabilityData);
    }

    const createdTrainer = await Trainer.findByPk(trainer.id, {
      include: [
        { model: TrainerAvailability, as: 'availabilities' }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdTrainer
    });
  } catch (error) {
    console.error("Add trainer error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all trainers for a branch
 * @route   GET /api/branches/:branchId/trainers
 * @access  Public
 */
exports.getBranchTrainers = async (req, res) => {
  try {
    const { branchId } = req.params;

    const trainers = await Trainer.findAll({
      where: { branchId },
      include: [
        { model: TrainerAvailability, as: 'availabilities' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: trainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a trainer
 * @route   PATCH /api/branches/:branchId/trainers/:trainerId
 * @access  Private/Admin
 */
exports.updateTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const {
      fullName,
      email,
      specialization,
      hourlyRate,
      bio,
      photo,
      availability
    } = req.body;

    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found"
      });
    }

    // 1. Update basic fields
    await trainer.update({
      fullName,
      email,
      specialization,
      hourlyRate,
      bio,
      photo
    });

    // 2. Replace Availabilities if provided
    if (availability !== undefined) {
      await TrainerAvailability.destroy({ where: { trainerId } });

      if (availability && availability.length > 0) {
        const availabilityData = availability.map(a => ({
          ...a,
          trainerId
        }));
        await TrainerAvailability.bulkCreate(availabilityData);
      }
    }

    const updatedTrainer = await Trainer.findByPk(trainerId, {
      include: [
        { model: TrainerAvailability, as: 'availabilities' }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedTrainer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
