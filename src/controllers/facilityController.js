const { Facility, Branch } = require('../../models');

/**
 * @desc    Create a new facility with operating hours and equipment
 * @route   POST /api/facilities
 * @access  Private/Admin
 */
exports.createFacility = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const facility = await Facility.create({
      name,
      description,
      image,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: facility
    });
  } catch (error) {
    console.error("Create facility error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all active facilities with pagination
 * @route   GET /api/facilities
 * @access  Public
 */
exports.getFacilities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: facilities } = await Facility.findAndCountAll({
      where: { isActive: true },
      include: [
        { model: Branch, as: 'branches' }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true // Required when using include and limit
    });

    res.status(200).json({
      success: true,
      data: facilities,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single facility details
 * @route   GET /api/facilities/:id
 * @access  Public
 */
exports.getFacility = async (req, res) => {
  try {
    const facility = await Facility.findByPk(req.params.id, {
      include: [
        { model: Branch, as: 'branches' }
      ]
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.status(200).json({
      success: true,
      data: facility
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update facility
 * @route   PATCH /api/facilities/:id
 * @access  Private/Admin
 */
exports.updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findByPk(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    await facility.update(req.body);

    const updatedFacility = await Facility.findByPk(facility.id, {
      include: [{ model: Branch, as: 'branches' }]
    });

    res.status(200).json({
      success: true,
      data: updatedFacility
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete (deactivate) facility
 * @route   DELETE /api/facilities/:id
 * @access  Private/Admin
 */
exports.deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findByPk(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    await facility.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Facility deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
