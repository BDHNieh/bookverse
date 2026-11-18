const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const readerController = require("../controllers/reader.controller");
const verifyToken = require("../middlewares/auth.middleware");
const ApiError = require("../api-error");

// RQ-09: cấu hình upload ảnh đại diện (tái sử dụng cơ chế multer của ảnh bìa sách)
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/uploads/");
  },
  filename: function (req, file, cb) {
    // Loại bỏ ký tự đặc biệt trong tên file để URL hiển thị luôn hợp lệ
    const safeName = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // NFR-05: tối đa 5MB
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const isValidType = ["image/jpeg", "image/png"].includes(file.mimetype) && [".jpg", ".jpeg", ".png"].includes(ext);
    cb(isValidType ? null : new Error("Only JPG/PNG images are allowed"), isValidType);
  },
});

// Bọc multer để trả về lỗi 400 rõ ràng (sai định dạng / vượt dung lượng) thay vì lỗi 500
const handleAvatarUpload = (req, res, next) => {
  uploadAvatar.single("avatar")(req, res, (err) => {
    if (err) {
      const message = err.code === "LIMIT_FILE_SIZE" ? "Image must not exceed 5MB" : err.message;
      return next(new ApiError(400, message));
    }
    if (!req.file) {
      return next(new ApiError(400, "No file uploaded"));
    }
    return res.json({ filename: req.file.filename });
  });
};

// ===== Public routes =====
router.route("/login").post(readerController.login);
router.route("/check").get(readerController.findUsername);
router.route("/").post(readerController.create);

// ===== Protected routes =====
router.route("/").get(verifyToken, readerController.findAll).delete(verifyToken, readerController.deleteAll);

// RQ-09: upload ảnh đại diện
router.post("/upload", verifyToken, handleAvatarUpload);

// RQ-10: đổi mật khẩu
router.route("/:id/password").put(verifyToken, readerController.changePassword);

router.route("/:id").get(verifyToken, readerController.findOne).put(verifyToken, readerController.update).delete(verifyToken, readerController.delete);

module.exports = router;
