const { Slot, Booking, Facility, User } = require('../../models');
const { Op } = require('sequelize');

/**
 * @desc    Create a slot (supports recurring)
 * @route   POST /api/slots
 * @access  Private/Admin
 */
exports.createSlot = async (req, res) => {
  try {
    const { facilityId, trainerId, date, startTime, endTime, capacityLimit, isRecurring, recurrenceCount = 4 } = req.body;

    const slotsToCreate = [];
    const baseDate = new Date(date);

    if (isRecurring === 'none') {
      slotsToCreate.push({ facilityId, trainerId, date, startTime, endTime, capacityLimit, isRecurring });
    } else {
      for (let i = 0; i < recurrenceCount; i++) {
        const slotDate = new Date(baseDate);
        if (isRecurring === 'daily') {
          slotDate.setDate(baseDate.getDate() + i);
        } else if (isRecurring === 'weekly') {
          slotDate.setDate(baseDate.getDate() + (i * 7));
        }
        
        slotsToCreate.push({
          facilityId,
          trainerId,
          date: slotDate.toISOString().split('T')[0],
          startTime,
          endTime,
          capacityLimit,
          isRecurring
        });
      }
    }

    const createdSlots = await Slot.bulkCreate(slotsToCreate);

    res.status(201).json({
      success: true,
      data: createdSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get slots for a date range (for Live Availability)
 * @route   GET /api/slots
 * @access  Public
 */
exports.getSlots = async (req, res) => {
  try {
    const { date, facilityId } = req.query;
    
    const where = { isActive: true };
    if (date) where.date = date;
    if (facilityId) where.facilityId = facilityId;

    const slots = await Slot.findAll({
      where,
      include: [
        { model: Facility, as: 'facility' },
        { model: User, as: 'trainer', attributes: ['id', 'name'] },
        { 
          model: Booking, 
          as: 'bookings',
          attributes: ['id', 'status']
        }
      ]
    });

    // Add derived availability info
    const enrichedSlots = slots.map(slot => {
        const confirmedBookings = slot.bookings.filter(b => b.status === 'confirmed').length;
        return {
            ...slot.toJSON(),
            bookedCount: confirmedBookings,
            availableCount: Math.max(0, slot.capacityLimit - confirmedBookings),
            status: confirmedBookings >= slot.capacityLimit ? 'soldout' : (confirmedBookings > (slot.capacityLimit * 0.7) ? 'limited' : 'available')
        };
    });

    res.status(200).json({
      success: true,
      data: enrichedSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get slot details with bookings
 * @route   GET /api/slots/:id
 * @access  Public
 */
exports.getSlot = async (req, res) => {
  try {
    const slot = await Slot.findByPk(req.params.id, {
      include: [
        { model: Facility, as: 'facility' },
        { model: User, as: 'trainer', attributes: ['id', 'name'] },
        { 
            model: Booking, 
            as: 'bookings',
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'mobile'] }]
        }
      ]
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update slot visibility
 * @route   PATCH /api/slots/:id/visibility
 * @access  Private/Admin
 */
exports.toggleVisibility = async (req, res) => {
  try {
    const slot = await Slot.findByPk(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

    await slot.update({ isVisible: !slot.isVisible });

    res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
