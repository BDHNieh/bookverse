const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const BookService = require("../services/book.service");

exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "Tên sách không được để trống"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const payload = {
      ...req.body,
      image: req.body.image,
    };
    const document = await bookService.create(payload);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const bookService = new BookService(MongoDB.client);
    documents = await bookService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving book"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving book with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error updating book with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(new ApiError(500, `Could not delete book with id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.deleteAll();
    return res.send({
      message: `${document.deletedCount} books were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all books"));
  }
};

exports.getRelated = async (req, res) => {
  try {
    const { id } = req.params;

    const bookService = new BookService(MongoDB.client);
    const book = await bookService.findById(id);

    if (!book) return res.status(404).send("Not found");

    const related = await bookService.findRelated(book.MaTheLoai, id);

    res.send(related);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};
