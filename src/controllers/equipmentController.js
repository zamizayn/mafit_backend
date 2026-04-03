const { Equipment } = require('../../models');

/**
 * @desc    Create new equipment under a branch
 * @route   POST /api/branches/:branchId/equipments
 * @access  Private/Admin
 */
exports.createEquipment = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (Array.isArray(req.body)) {
      const equipmentsData = req.body.map(item => ({ ...item, branchId }));
      const equipments = await Equipment.bulkCreate(equipmentsData);

      return res.status(201).json({
        success: true,
        data: equipments
      });
    }

    const equipmentData = { ...req.body, branchId };

    const equipment = await Equipment.create(equipmentData);

    res.status(201).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error("Create equipment error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all equipments for a branch
 * @route   GET /api/branches/:branchId/equipments
 * @access  Public
 */
exports.getEquipments = async (req, res) => {
  try {
    const { branchId } = req.params;
    const equipments = await Equipment.findAll({
      where: { branchId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: equipments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single equipment
 * @route   GET /api/branches/:branchId/equipments/:id
 * @access  Public
 */
exports.getEquipment = async (req, res) => {
  try {
    const { branchId, id } = req.params;
    const equipment = await Equipment.findOne({
      where: { id, branchId }
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update equipment
 * @route   PATCH /api/branches/:branchId/equipments/:id
 * @access  Private/Admin
 */
exports.updateEquipment = async (req, res) => {
  try {
    const { branchId, id } = req.params;
    const equipment = await Equipment.findOne({
      where: { id, branchId }
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    await equipment.update(req.body);

    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete equipment
 * @route   DELETE /api/branches/:branchId/equipments/:id
 * @access  Private/Admin
 */
exports.deleteEquipment = async (req, res) => {
  try {
    const { branchId, id } = req.params;
    const equipment = await Equipment.findOne({
      where: { id, branchId }
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    await equipment.destroy();

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
