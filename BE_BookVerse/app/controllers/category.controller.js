const categoryService = require("../services/category.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const service = new categoryService(MongoDB.client);
    const result = await service.create(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const service = new categoryService(MongoDB.client);
    const result = await service.find();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
