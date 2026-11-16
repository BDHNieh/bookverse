const { ObjectId } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");
const BookService = require("../services/book.service");

class BorrowService {
  constructor(client) {
    this.Borrow = client.db().collection("TheoDoiMuonSach");
    this.DocGia = client.db().collection("DocGia");
  }

  extractBorrowData(payload) {
    const Borrow = {};

    if (payload.MaDocGia && ObjectId.isValid(payload.MaDocGia)) {
      Borrow.MaDocGia = new ObjectId(payload.MaDocGia);
    }

    if (payload.MaSach && ObjectId.isValid(payload.MaSach)) {
      Borrow.MaSach = new ObjectId(payload.MaSach);
    }

    if (payload.NgayMuon) {
      Borrow.NgayMuon = new Date(payload.NgayMuon);
    }

    if (payload.NgayTra) {
      Borrow.NgayTra = new Date(payload.NgayTra);
    }

    if (payload.TrangThai) {
      Borrow.TrangThai = payload.TrangThai;
    }

    return Borrow;
  }

  async create(payload) {
    const borrowData = this.extractBorrowData(payload);

    const docGia = await this.DocGia.findOne({
      _id: borrowData.MaDocGia,
    });

    if (!docGia) {
      throw new Error("Độc giả không tồn tại");
    }

    if (docGia.TrangThaiThe !== "active") {
      throw new Error("Tài khoản đã bị khóa, không thể mượn sách!");
    }

    borrowData.TrangThai = "Chờ duyệt";

    const result = await this.Borrow.insertOne(borrowData);

    return await this.findById(result.insertedId);
  }

  async find(filter) {
    const cursor = await this.Borrow.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "DocGia",
          localField: "MaDocGia",
          foreignField: "_id",
          as: "docgia_info",
        },
      },
      {
        $unwind: {
          path: "$docgia_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Sach",
          localField: "MaSach",
          foreignField: "_id",
          as: "sach_info",
        },
      },
      {
        $unwind: {
          path: "$sach_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "sach_info.image": {
            $cond: {
              if: { $ifNull: ["$sach_info.image", false] },
              then: { $concat: ["http://localhost:3000/api/upload/", "$sach_info.image"] },
              else: null,
            },
          },
        },
      },
    ]);

    return await cursor.toArray();
  }

  async findById(id) {
    const bb = await this.find({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return bb[0] || null;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractBorrowData(payload);

    const existingBorrow = await this.Borrow.findOne(filter);
    if (!existingBorrow) return null;

    const bookService = new BookService(MongoDB.client);

    if (payload.TrangThai === "Đang mượn") {
      const success = await bookService.reserveBook(existingBorrow.MaSach);

      if (!success) {
        throw new Error("Sách đã hết, không thể duyệt!");
      }
    }

    if (payload.TrangThai === "Đã trả") {
      const success = await bookService.returnBook(existingBorrow.MaSach);

      if (!success) {
        throw new Error("Lỗi khi trả sách!");
      }
    }

    const result = await this.Borrow.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" });

    const updatedBorrow = result.value;
    if (!updatedBorrow) return null;

    const finalResult = await this.find({ _id: updatedBorrow._id });
    return finalResult[0] || null;
  }

  async deleteAll() {
    const result = await this.Borrow.deleteMany({});
    return result;
  }

  async findOverdue() {
    const today = new Date();

    return await this.find({
      NgayTra: { $lt: today },
      TrangThai: "Đang mượn",
    });
  }
}

module.exports = BorrowService;
