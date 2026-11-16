const { ObjectId } = require("mongodb");

class categoryService {
  constructor(client) {
    this.category = client.db().collection("category");
  }

  extractData(payload) {
    const data = {
      TenTheLoai: payload.TenTheLoai,
    };

    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
    return data;
  }

  async create(payload) {
    const data = this.extractData(payload);
    const result = await this.category.insertOne(data);
    return result;
  }

  async find() {
    return await this.category.find({}).toArray();
  }

  async findById(id) {
    return await this.category.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async delete(id) {
    return await this.category.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
}

module.exports = categoryService;
