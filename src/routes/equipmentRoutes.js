const express = require('express');
const router = express.Router({ mergeParams: true });
const equipmentController = require('../controllers/equipmentController');

// All routes are implicitly prepended with /branches/:branchId/equipments

router.post('/', equipmentController.createEquipment);
router.get('/', equipmentController.getEquipments);
router.get('/:id', equipmentController.getEquipment);
router.patch('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
