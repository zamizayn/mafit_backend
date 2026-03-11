const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
// const { auth, admin } = require('../middlewares/auth'); // Placeholder for auth middlewares

// For now, keeping routes public or basic for testing
router.post('/', facilityController.createFacility);
router.get('/', facilityController.getFacilities);
router.get('/:id', facilityController.getFacility);
router.patch('/:id', facilityController.updateFacility);
router.delete('/:id', facilityController.deleteFacility);

module.exports = router;
