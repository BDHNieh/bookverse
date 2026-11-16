const express = require("express");
const router = express.Router();
const readerController = require("../controllers/reader.controller");
const verifyToken = require("../middlewares/auth.middleware");

// ===== Public routes =====
router.route("/login").post(readerController.login);
router.route("/check").get(readerController.findUsername);
router.route("/").post(readerController.create);

// ===== Protected routes =====
router.route("/").get(verifyToken, readerController.findAll).delete(verifyToken, readerController.deleteAll);

router.route("/:id").get(verifyToken, readerController.findOne).put(verifyToken, readerController.update).delete(verifyToken, readerController.delete);

module.exports = router;
