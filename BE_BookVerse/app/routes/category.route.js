const express = require("express");
const router = express.Router();
const category = require("../controllers/category.controller");

router.post("/", category.create);
router.get("/", category.findAll);

module.exports = router;
