const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// const { auth } = require('../middlewares/auth'); // Placeholder

// Member routes
router.post('/', bookingController.createBooking);
router.get('/my', bookingController.getMyBookings);

// Admin routes
router.patch('/:id/check-in', bookingController.checkIn);

module.exports = router;
