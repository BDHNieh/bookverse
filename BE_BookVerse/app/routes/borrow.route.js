const express = require("express");
const router = express.Router();
const BorrowController = require("../controllers/borrow.controller");

router.route("/").get(BorrowController.findAll).post(BorrowController.create).delete(BorrowController.deleteAll);
router.get("/user/:id", BorrowController.findByUser);
router.route("/:id").get(BorrowController.findOne).put(BorrowController.update).delete(BorrowController.delete);

module.exports = router;
