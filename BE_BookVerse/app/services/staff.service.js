const { ObjectId } = require("mongodb");

class StaffService {
  constructor(client) {
    this.Staff = client.db().collection("NhanVien");
  }

  extractStaffData(payload) {
    const staff = {
      Username: payload.Username,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      DiaChi: payload.DiaChi,
      Email: payload.Email,
      SoDienThoai: payload.SoDienThoai,
    };

    Object.keys(staff).forEach((key) => staff[key] === undefined && delete staff[key]);
    return staff;
  }

  async create(payload) {
    const staff = this.extractStaffData(payload);
    const result = await this.Staff.insertOne(staff);
    return await this.findById(result.insertedId);
  }

  async find(filter) {
    const cursor = await this.Staff.find(filter);
    return await cursor.toArray();
  }

  async findUsername(username) {
    return await this.Staff.findOne({
      Username: { $regex: new RegExp(`^${username}$`), $options: "i" },
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;

    return await this.Staff.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractStaffData(payload);
    const result = await this.Staff.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });
    return result.value;
  }

  async delete(id) {
    const result = await this.Staff.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Staff.deleteMany({});
    return result;
  }
}

module.exports = StaffService;
