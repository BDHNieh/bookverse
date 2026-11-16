const express = require("express");
const multer = require("multer");
const router = express.Router();
const BookController = require("../controllers/book.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload ảnh bìa sách
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ filename: req.file.filename });
});

router.route("/").get(BookController.findAll).post(BookController.create).delete(BookController.deleteAll);
router.get("/:id/related", BookController.getRelated);
router.route("/:id").get(BookController.findOne).put(BookController.update).delete(BookController.delete);

module.exports = router;
