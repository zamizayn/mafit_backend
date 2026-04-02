const { Branch, Facility, BranchWeeklySlot, Slot, FacilityOperatingHours, Equipment, Trainer, TrainerAvailability } = require('../../models');

/**
 * @desc    Create a new branch under a facility category
 * @route   POST /api/branches
 * @access  Private/Admin
 */
exports.createBranch = async (req, res) => {
  try {
    const {
      facilityId,
      name,
      location,
      description,
      image,
      maxCapacity,
      weeklySlots,
      operatingHours,
      equipment
    } = req.body;

    // 1. Create the Branch
    const branch = await Branch.create({
      facilityId,
      name,
      location,
      description,
      image,
      maxCapacity,
      isActive: true
    });

    // 2. Handle Weekly Slots configuration
    if (weeklySlots && weeklySlots.length > 0) {
      const weeklySlotsData = weeklySlots.map(ws => ({
        ...ws,
        branchId: branch.id
      }));
      await BranchWeeklySlot.bulkCreate(weeklySlotsData);

      // 3. Generate actual bookable slots for the next 30 days
      const slotsToCreate = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const dayOfWeek = currentDate.getDay(); // 0-6

        const templatesForDay = weeklySlots.filter(ws => ws.dayOfWeek === dayOfWeek);

        templatesForDay.forEach(template => {
          slotsToCreate.push({
            branchId: branch.id,
            date: currentDate.toISOString().split('T')[0],
            startTime: template.startTime,
            endTime: template.endTime,
            capacityLimit: template.capacityLimit || maxCapacity,
            isRecurring: 'weekly',
            isVisible: true,
            isActive: true
          });
        });
      }

      if (slotsToCreate.length > 0) {
        await Slot.bulkCreate(slotsToCreate);
      }
    }

    // 4. Handle Operating Hours
    if (operatingHours && operatingHours.length > 0) {
      const hoursData = operatingHours.map(h => ({
        ...h,
        branchId: branch.id
      }));
      await FacilityOperatingHours.bulkCreate(hoursData);
    }

    // 5. Handle Equipment
    if (equipment && equipment.length > 0) {
      const equipmentData = equipment.map(e => ({
        ...e,
        branchId: branch.id
      }));
      await Equipment.bulkCreate(equipmentData);
    }

    const createdBranch = await Branch.findByPk(branch.id, {
      include: [
        { model: Facility, as: 'category' },
        { model: BranchWeeklySlot, as: 'weeklySlots' },
        { model: FacilityOperatingHours, as: 'operatingHours' },
        { model: Equipment, as: 'equipment' }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdBranch
    });
  } catch (error) {
    console.error("Create branch error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all branches
 * @route   GET /api/branches
 * @access  Public
 */
exports.getBranches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Automatically filter for Gym category
    const gymFacility = await Facility.findOne({ where: { name: 'Gym' } });

    if (!gymFacility) {
      return res.status(404).json({ success: false, message: "Gym category not found" });
    }

    const where = {
      isActive: true,
      facilityId: gymFacility.id
    };

    const { count, rows: branches } = await Branch.findAndCountAll({
      where,
      attributes: ['id', 'name', 'description', 'image'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: branches,
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
 * @desc    Get single branch details
 * @route   GET /api/branches/:id
 * @access  Public
 */
exports.getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id, {
      include: [
        { model: Facility, as: 'category' },
        { model: BranchWeeklySlot, as: 'weeklySlots' },
        { model: FacilityOperatingHours, as: 'operatingHours' },
        { model: Equipment, as: 'equipment' },
        {
          model: Trainer,
          as: 'trainers',
          include: [{ model: TrainerAvailability, as: 'availabilities' }]
        }
      ]
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    res.status(200).json({
      success: true,
      data: branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a branch
 * @route   DELETE /api/branches/:id
 * @access  Private/Admin
 */
exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    await branch.update({ isActive: false });

    // Optionally also deactivate related slots to hide them
    await Slot.update({ isActive: false }, { where: { branchId: id } });

    res.status(200).json({
      success: true,
      message: "Branch deactivated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
