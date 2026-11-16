const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const verifyToken = require("../middlewares/auth.middleware");

// ===== Public routes =====
router.post("/login", staffController.login);
router.get("/check", staffController.findUsername);
router.post("/", staffController.create);

// ===== Protected routes =====
router.get("/", verifyToken, staffController.findAll);
router.delete("/", verifyToken, staffController.deleteAll);

router.get("/:id", verifyToken, staffController.findOne);
router.put("/:id", verifyToken, staffController.update);
router.delete("/:id", verifyToken, staffController.delete);

module.exports = router;
