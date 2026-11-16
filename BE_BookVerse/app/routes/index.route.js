const express = require("express");
const router = express.Router();

const readerRouter = require("./reader.route");
const bookRouter = require("./book.route");
const publisherRouter = require("./publisher.route");
const BorrowRouter = require("./borrow.route");
const StaffRouter = require("./staff.route");

router.use("/reader", readerRouter);
router.use("/book", bookRouter);
router.use("/staff", StaffRouter);
router.use("/publisher", publisherRouter);
router.use("/borrow", BorrowRouter);

router.get("/", (req, res) => {
  res.json({ message: "Welcome back, Endministrator!" });
});

module.exports = router;
