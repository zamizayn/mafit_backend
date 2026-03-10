const router = require("express").Router();
const controller = require("../controllers/permissionController");

router.post("/", controller.createPermission);
router.get("/", controller.getPermissions);
router.get("/:id", controller.getPermission);
router.put("/:id", controller.updatePermission);
router.delete("/:id", controller.deletePermission);

module.exports = router;