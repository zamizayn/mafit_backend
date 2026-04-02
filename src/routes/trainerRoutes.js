const express = require('express');
const router = express.Router({ mergeParams: true });
const trainerController = require('../controllers/trainerController');

// Routes for /branches/:branchId/trainers
router.post('/', trainerController.addTrainer);
router.get('/', trainerController.getBranchTrainers);

module.exports = router;
