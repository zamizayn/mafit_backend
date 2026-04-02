const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

const trainerRoutes = require('./trainerRoutes');

// For now, keeping routes public or basic for testing
router.post('/', branchController.createBranch);
router.get('/', branchController.getBranches);
router.get('/:id', branchController.getBranch);
router.delete('/:id', branchController.deleteBranch);

// Nested routes
router.use('/:branchId/trainers', trainerRoutes);

module.exports = router;
