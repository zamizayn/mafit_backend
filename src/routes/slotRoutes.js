const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/', slotController.createSlot);
router.get('/', slotController.getSlots);
router.get('/:id', slotController.getSlot);
router.patch('/:id/visibility', slotController.toggleVisibility);

module.exports = router;
