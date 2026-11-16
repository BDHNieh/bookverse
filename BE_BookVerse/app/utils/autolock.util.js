const BorrowService = require("../services/borrow.service");
const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util");
const { sendOverdueEmail } = require("./mail.util");

async function autoLockOverdueReaders() {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const readerService = new ReaderService(MongoDB.client);

    const overdueList = await borrowService.findOverdue();
    console.log("Overdue list:", overdueList);

    if (overdueList.length === 0) {
      console.log("AutoLock: No overdue records.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await borrowService.Borrow.updateMany(
      {
        NgayTra: { $lt: today },
        TrangThai: "Đang mượn",
      },
      { $set: { TrangThai: "Quá hạn" } },
    );

    // Lấy danh sách độc giả duy nhất
    const uniqueReaders = [...new Set(overdueList.map((r) => r.MaDocGia.toString()))];

    for (const id of uniqueReaders) {
      const reader = await readerService.findById(id);

      // 1. Khóa tài khoản
      await readerService.lock(id);

      // 2. Gửi mail (nếu có email)
      if (reader?.Email) {
        const readerBorrows = overdueList.filter((b) => b.MaDocGia.toString() === id);
        console.log("Preparing to send mail:", reader.Email);

        await sendOverdueEmail(reader.Email, reader.HoTen, readerBorrows);
      }
    }

    console.log(`AutoLock: ${uniqueReaders.length} reader(s) locked.`);
  } catch (error) {
    console.error("AutoLock error:", error);
  }
}

function startAutoLock() {
  autoLockOverdueReaders();

  setInterval(() => {
    console.log("AutoLock running...");
    autoLockOverdueReaders();
  }, 60 * 1000);
}

module.exports = startAutoLock;
