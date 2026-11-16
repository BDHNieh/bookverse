const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const BorrowService = require("../services/borrow.service");
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach || !req.body?.NgayMuon) {
    return next(new ApiError(400, "MaDocGia, MaSach and NgayMuon can't be empty"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.create(req.body);

    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating the book borrow"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const borrowService = new BorrowService(MongoDB.client);
    if (req.query?.MaDocGia && ObjectId.isValid(req.query.MaDocGia)) {
      documents = await borrowService.find({
        MaDocGia: new ObjectId(req.query.MaDocGia),
      });
    } else documents = await borrowService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving book borrow"));
  }
  return res.send(documents);
};

exports.findByUser = async (req, res, next) => {
  if (!req.params?.id) return next(new ApiError(400, "MaDocGia can't be empty"));
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const documents = await borrowService.find({
      MaDocGia: new ObjectId(req.params.id),
    });
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving book borrow"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const _id = req.params.borrowId || req.params.id;
    const document = await borrowService.findById(_id);
    if (!document) {
      return next(new ApiError(404, "Book borrow not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving book borrow with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.update(req.params.id, req.body);

    return res.send({ message: "Update succesfully" });
  } catch (error) {
    return next(new ApiError(500, `Error updating book borrow with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book borrow not found"));
    }
    return res.send({ message: "Book borrow was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, `Could not delete book borrow with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.deleteAll();
    return res.send({
      message: `${document.deletedCount} book borrows were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all book borrows"));
  }
};
