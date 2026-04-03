const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

const trainerRoutes = require('./trainerRoutes');
const equipmentRoutes = require('./equipmentRoutes');

// For now, keeping routes public or basic for testing
router.post('/', branchController.createBranch);
router.get('/', branchController.getBranches);
router.get('/:id', branchController.getBranch);
router.patch('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

// Nested routes
router.use('/:branchId/trainers', trainerRoutes);
router.use('/:branchId/equipments', equipmentRoutes);

module.exports = router;
