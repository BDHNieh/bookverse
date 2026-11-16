const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("Sach");
  }

  extractBookData(payload) {
    const book = {
      TenSach: payload.TenSach,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: ObjectId.isValid(payload.MaNXB) ? new ObjectId(payload.MaNXB) : null,
      MoTa: payload.MoTa,
      TacGia: payload.TacGia,
      image: payload.image,
      rate: payload.rate,
      MaTheLoai: Array.isArray(payload.MaTheLoai) ? payload.MaTheLoai.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) : [],
    };

    // Loại bỏ các trường undefined
    Object.keys(book).forEach((key) => book[key] === undefined && delete book[key]);
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);

    const result = await this.Book.insertOne(book);

    return result;
  }

  async find(filter) {
    const cursor = await this.Book.aggregate([
      {
        $match: filter,
      },

      {
        $lookup: {
          from: "NhaXuatBan",
          localField: "MaNXB",
          foreignField: "_id",
          as: "nxb_info",
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "MaTheLoai",
          foreignField: "_id",
          as: "theloai_info",
        },
      },

      {
        $unwind: {
          path: "$nxb_info",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return await cursor.toArray();
  }

  async findRelated(maTheLoai, excludeId) {
    return await this.Book.aggregate([
      {
        $match: {
          MaTheLoai: { $in: maTheLoai.map((id) => new ObjectId(id)) },
          _id: { $ne: new ObjectId(excludeId) },
        },
      },
      {
        $lookup: {
          from: "NhaXuatBan",
          localField: "MaNXB",
          foreignField: "_id",
          as: "nxb_info",
        },
      },
      {
        $unwind: {
          path: "$nxb_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $limit: 4,
      },
    ]).toArray();
  }

  async findById(id) {
    const result = await this.find({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result[0] || null;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractBookData(payload);

    const result = await this.Book.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });

    if (!result) {
      return null;
    }

    return result;
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result;
  }

  async reserveBook(maSach) {
    if (!ObjectId.isValid(maSach)) return false;

    const result = await this.Book.updateOne(
      {
        _id: new ObjectId(maSach),
        SoQuyen: { $gt: 0 }, // chỉ trừ khi còn sách
      },
      {
        $inc: { SoQuyen: -1 },
      },
    );

    return result.modifiedCount > 0;
  }

  async returnBook(maSach) {
    if (!ObjectId.isValid(maSach)) return false;

    const result = await this.Book.updateOne({ _id: new ObjectId(maSach) }, { $inc: { SoQuyen: 1 } });

    return result.modifiedCount > 0;
  }
}

module.exports = BookService;
