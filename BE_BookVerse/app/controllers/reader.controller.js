const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const ReaderService = require("../services/reader.service");
const jwt = require("jsonwebtoken");
const config = require("../config/index.js");

exports.create = async (req, res, next) => {
  const { Username, Password, Email, SoDienThoai } = req.body || {};

  // RQ-04: kiểm tra dữ liệu đầu vào (đồng nhất với schema yup ở Frontend)
  if (!Username || !Password || !Email || !SoDienThoai) {
    return next(new ApiError(400, "Username, Password, Email and Phone Number can't be empty"));
  }
  if ([Username, Password, Email, SoDienThoai].some((value) => typeof value !== "string")) {
    return next(new ApiError(400, "Invalid data format"));
  }
  if (Username.length < 6 || Username.length > 20) {
    return next(new ApiError(400, "Username must be 6-20 characters"));
  }
  if (Password.length < 8) {
    return next(new ApiError(400, "Password must be at least 8 characters"));
  }
  if (!/^\S+@\S+\.\S+$/.test(Email)) {
    return next(new ApiError(400, "Invalid email format"));
  }
  if (!/^\d{10,11}$/.test(SoDienThoai)) {
    return next(new ApiError(400, "Phone number must be 10-11 digits"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);

    const existedUsername = await readerService.findUsername(Username);
    if (existedUsername) {
      return next(new ApiError(400, "Username already exists"));
    }
    const existedEmail = await readerService.findEmail(Email);
    if (existedEmail) {
      return next(new ApiError(400, "Email already exists"));
    }

    const document = await readerService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the reader"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const readerService = new ReaderService(MongoDB.client);
    documents = await readerService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving readers"));
  }
  return res.send(documents);
};

exports.findUsername = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);

    const { Username } = req.query;

    if (!Username) {
      return next(new ApiError(400, "Username is required"));
    }
    const document = await readerService.findUsername(Username);

    return res.send({ exists: !!document });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while checking username"));
  }
};

exports.login = async (req, res, next) => {
  const { Username, Password } = req.body || {};

  // RQ-05: chặn dữ liệu rỗng trước khi truy vấn CSDL
  if (!Username || !Password) {
    return next(new ApiError(400, "Username and Password can't be empty"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);
    const reader = await readerService.findUsername(Username);

    if (!reader || reader.Password !== Password) {
      return next(new ApiError(401, "Invalid username or password"));
    }

    const token = jwt.sign({ id: reader._id, username: reader.Username }, config.jwt.secret, { expiresIn: "24h" });

    return res.send({
      token: token,
      user: {
        _id: reader._id,
        Ten: reader.Ten,
        Username: reader.Username,
        Avatar: reader.Avatar, // RQ-09: trả về ảnh đại diện để Header hiển thị ngay sau khi đăng nhập
        role: "user",
      },
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while logging in"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Reader not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving reader with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Reader not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error updating reader with id=${req.params.id}`));
  }
};

// RQ-10: Đổi mật khẩu - PUT /api/reader/:id/password
exports.changePassword = async (req, res, next) => {
  const { OldPassword, NewPassword } = req.body || {};

  // Chỉ chủ tài khoản (đúng id trong JWT) mới được đổi mật khẩu của chính mình
  if (req.user?.role === "staff" || String(req.user?.id) !== String(req.params.id)) {
    return next(new ApiError(403, "You can only change your own password"));
  }
  if (!OldPassword || !NewPassword) {
    return next(new ApiError(400, "Old password and new password can't be empty"));
  }
  if (typeof OldPassword !== "string" || typeof NewPassword !== "string") {
    return next(new ApiError(400, "Invalid password format"));
  }
  if (NewPassword.length < 8) {
    return next(new ApiError(400, "New password must be at least 8 characters"));
  }
  if (NewPassword === OldPassword) {
    return next(new ApiError(400, "New password must be different from the old password"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);
    const reader = await readerService.findById(req.params.id);
    if (!reader) {
      return next(new ApiError(404, "Reader not found"));
    }
    if (reader.Password !== OldPassword) {
      return next(new ApiError(400, "Old password is incorrect"));
    }

    await readerService.changePassword(req.params.id, NewPassword);
    return res.send({ message: "Password was changed successfully" });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while changing the password"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Reader not found"));
    }
    return res.send({ message: "Reader was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, `Could not delete reader with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.deleteAll();
    return res.send({
      message: `${document.deletedCount} readers were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all readers"));
  }
};
