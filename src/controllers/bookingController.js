const { Booking, Slot, User } = require('../../models');

/**
 * @desc    Create a booking for a slot
 * @route   POST /api/bookings
 * @access  Private/Member
 */
exports.createBooking = async (req, res) => {
  try {
    const { slotId } = req.body;
    const { userId } = req.user; // Assumes auth middleware sets req.user

    const slot = await Slot.findByPk(slotId, {
      include: [{ model: Booking, as: 'bookings', where: { status: 'confirmed' }, required: false }]
    });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.bookings.length >= slot.capacityLimit) {
      return res.status(400).json({ success: false, message: 'Slot is full' });
    }

    const booking = await Booking.create({
      slotId,
      userId,
      paymentStatus: 'pending',
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get member's own bookings
 * @route   GET /api/bookings/my
 * @access  Private/Member
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.userId },
      include: [{ model: Slot, as: 'slot', include: ['facility', { model: User, as: 'trainer', attributes: ['name'] }] }]
    });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Mark member as checked in
 * @route   PATCH /api/bookings/:id/check-in
 * @access  Private/Admin
 */
exports.checkIn = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    await booking.update({ checkInTime: new Date() });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
