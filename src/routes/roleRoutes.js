const router = require("express").Router();
const controller = require("../controllers/roleController");

router.post("/", controller.createRole);
router.get("/", controller.getRoles);
router.put("/:id", controller.updateRole);
router.delete("/:id", controller.deleteRole);

router.post("/assign-permissions", controller.assignPermissionsToRole);
router.get("/:id/permissions", controller.getRolePermissions);

module.exports = router;