require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOverdueEmail(toEmail, readerName, borrowList = []) {
  const today = new Date();

  const rows = borrowList
    .map((item, index) => {
      const dueDate = new Date(item.NgayTra);
      const overdueDays = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.sach_info?.TenSach || "Không rõ"}</td>
          <td>${dueDate.toLocaleDateString("vi-VN")}</td>
          <td style="color:red; font-weight:bold;">${overdueDays} ngày</td>
        </tr>
      `;
    })
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "📌 Thông báo quá hạn trả sách",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:10px;">

          <h2 style="color:#d9534f;">⚠️ Thông báo quá hạn trả sách</h2>

          <p>Xin chào <b>${readerName}</b>,</p>

          <p>Bạn hiện đang có các sách <b>quá hạn trả</b>. Vui lòng trả sách sớm để tránh bị khóa tài khoản vĩnh viễn.</p>

          <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse; margin-top:15px;">
            <thead style="background:#f0f0f0;">
              <tr>
                <th>#</th>
                <th>Tên sách</th>
                <th>Hạn trả</th>
                <th>Quá hạn</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <p style="margin-top:20px; color:#555;">
            ⚠️ Tài khoản của bạn có thể bị <b>khóa vĩnh viễn</b> nếu tiếp tục vi phạm.
          </p>

          <p>Trân trọng,<br><b>BookVerse</b></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", toEmail);
  } catch (err) {
    console.error("Send mail error:", err);
  }
}

module.exports = { sendOverdueEmail };
