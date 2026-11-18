/**
 * Kiểm thử tự động (mức controller) cho các yêu cầu bảo trì RQ-04, RQ-05, RQ-09, RQ-10.
 * Chạy:  npm test     (hoặc: node tests/reader.maintenance.test.js)
 *
 * Không cần MongoDB đang chạy: CSDL được giả lập bằng một collection in-memory,
 * phần còn lại (controller, service, jsonwebtoken, ObjectId) dùng đúng mã nguồn thật.
 */
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const MongoDB = require("../app/utils/mongodb.util");
const ctrl = require("../app/controllers/reader.controller");

// ---------- CSDL giả lập ----------
const docs = [];
let seq = 1;
const newId = () => new ObjectId((seq++).toString(16).padStart(24, "0"));
const matches = (doc, filter) =>
  Object.entries(filter).every(([key, cond]) => {
    if (key === "_id") return cond && String(doc._id) === String(cond);
    if (cond && cond.$regex) return new RegExp(cond.$regex.source, cond.$options || "").test(doc[key] ?? "");
    return doc[key] === cond;
  });
const collection = {
  insertOne: async (doc) => {
    doc._id = newId();
    docs.push(doc);
    return { insertedId: doc._id };
  },
  findOne: async (filter) => docs.find((d) => matches(d, filter)) || null,
  findOneAndUpdate: async (filter, update) => {
    const doc = docs.find((d) => matches(d, filter));
    if (doc) Object.assign(doc, update.$set);
    return doc || null;
  },
  updateOne: async (filter, update) => {
    const doc = docs.find((d) => matches(d, filter));
    if (doc) Object.assign(doc, update.$set);
    return { matchedCount: doc ? 1 : 0 };
  },
};
MongoDB.client = { db: () => ({ collection: () => collection }) };

// ---------- Tiện ích ----------
const call = async (handler, { body = {}, params = {}, user } = {}) => {
  let out = {};
  await handler(
    { body, params, query: {}, user },
    { send: (data) => (out = { status: 200, body: data }) },
    (err) => (out = { status: err.statusCode, body: { message: err.message } }),
  );
  return out;
};

let passed = 0;
let failed = 0;
const check = (name, actual, expected) => {
  const ok = actual === expected;
  ok ? passed++ : failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  (nhận ${actual}, mong đợi ${expected})`}`);
};

(async () => {
  const valid = { Username: "nguyenvan01", Password: "matkhau123", Email: "van@ctu.edu.vn", SoDienThoai: "0349525034", HoTen: "Nguyen Van" };

  // ===== RQ-04: Đăng ký =====
  let r = await call(ctrl.create, { body: { ...valid, Username: "" } });
  check("RQ-04  Username để trống -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, Username: "abc12" } });
  check("RQ-04  Username 5 ký tự -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, Username: "a".repeat(21) } });
  check("RQ-04  Username 21 ký tự -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, Password: "1234567" } });
  check("RQ-04  Password 7 ký tự -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, Email: "van@ctu" } });
  check("RQ-04  Email sai định dạng -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, SoDienThoai: "03495abc34" } });
  check("RQ-04  SĐT chứa chữ cái -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, SoDienThoai: "123456789" } });
  check("RQ-04  SĐT 9 số -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, SoDienThoai: "123456789012" } });
  check("RQ-04  SĐT 12 số -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, Username: 123456789 } });
  check("RQ-04  Username không phải chuỗi -> 400", r.status, 400);
  r = await call(ctrl.create, {});
  check("RQ-04  Body rỗng không gây lỗi hệ thống -> 400", r.status, 400);
  r = await call(ctrl.create, { body: valid });
  check("RQ-04  Dữ liệu hợp lệ -> tạo tài khoản (200)", r.status, 200);
  const created = r.body;
  r = await call(ctrl.create, { body: { ...valid, Username: "NGUYENVAN01", Email: "khac@ctu.edu.vn" } });
  check("RQ-04  Username đã tồn tại (không phân biệt hoa/thường) -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, Username: "nguoikhac01", Email: "VAN@ctu.edu.vn" } });
  check("RQ-04  Email đã tồn tại -> 400", r.status, 400);
  r = await call(ctrl.create, { body: { ...valid, Username: "nguoikhac01", Email: "vanXctuYeduZvn@ctu.edu.vn" } });
  check("RQ-04  Dấu '.' trong Email không bị hiểu là ký tự regex -> 200", r.status, 200);
  r = await call(ctrl.create, { body: { ...valid, Username: "......", Email: "dot@ctu.edu.vn" } });
  check("RQ-04  Username '......' không khớp nhầm username khác -> 200", r.status, 200);

  // ===== RQ-05: Đăng nhập (+ RQ-09: trả về Avatar) =====
  r = await call(ctrl.login, { body: { Username: "", Password: "" } });
  check("RQ-05  Username/Password để trống -> 400", r.status, 400);
  r = await call(ctrl.login, {});
  check("RQ-05  Không có body không gây lỗi hệ thống -> 400", r.status, 400);
  r = await call(ctrl.login, { body: { Username: "khongtontai", Password: "x12345678" } });
  check("RQ-05  Username không tồn tại -> 401", r.status, 401);
  r = await call(ctrl.login, { body: { Username: valid.Username, Password: "saimatkhau" } });
  check("RQ-05  Sai Password -> 401", r.status, 401);
  r = await call(ctrl.login, { body: { Username: valid.Username, Password: valid.Password } });
  check("RQ-05  Thông tin hợp lệ -> 200 kèm token", r.status === 200 && !!r.body.token, true);
  const payload = jwt.decode(r.body.token);
  check("RQ-05  Cấu trúc JWT không đổi (id, username)", ["id", "username"].every((k) => k in payload), true);
  check("RQ-09  Kết quả đăng nhập có trường Avatar", "Avatar" in r.body.user, true);

  // ===== RQ-09: Lưu ảnh đại diện =====
  const id = String(created._id);
  r = await call(ctrl.update, { params: { id }, body: { Avatar: "1700000000-me.png", HoTen: "Nguyen Van A" } });
  check("RQ-09  Cập nhật Avatar vào hồ sơ -> 200", r.status, 200);
  r = await call(ctrl.login, { body: { Username: valid.Username, Password: valid.Password } });
  check("RQ-09  Đăng nhập trả về Avatar đã lưu", r.body.user.Avatar, "1700000000-me.png");

  // ===== RQ-10: Đổi mật khẩu =====
  const me = { id, username: valid.Username };
  const change = (body, user, paramId = id) => call(ctrl.changePassword, { params: { id: paramId }, body, user });
  r = await change({ OldPassword: valid.Password, NewPassword: "matkhaumoi1" }, null);
  check("RQ-10  Không có thông tin xác thực -> 403", r.status, 403);
  r = await change({ OldPassword: valid.Password, NewPassword: "matkhaumoi1" }, { id: "000000000000000000000099" });
  check("RQ-10  Đổi mật khẩu của tài khoản khác -> 403", r.status, 403);
  r = await change({ OldPassword: valid.Password, NewPassword: "matkhaumoi1" }, { id, role: "staff" });
  check("RQ-10  Token nhân viên -> 403", r.status, 403);
  r = await change({ OldPassword: "", NewPassword: "" }, me);
  check("RQ-10  Để trống các trường -> 400", r.status, 400);
  r = await change({ OldPassword: valid.Password }, me);
  check("RQ-10  Thiếu mật khẩu mới -> 400", r.status, 400);
  r = await change({ OldPassword: { $ne: "" }, NewPassword: "matkhaumoi1" }, me);
  check("RQ-10  Mật khẩu dạng object (NoSQL injection) -> 400", r.status, 400);
  r = await change({ OldPassword: valid.Password, NewPassword: "1234567" }, me);
  check("RQ-10  Mật khẩu mới 7 ký tự -> 400", r.status, 400);
  r = await change({ OldPassword: valid.Password, NewPassword: valid.Password }, me);
  check("RQ-10  Mật khẩu mới trùng mật khẩu hiện tại -> 400", r.status, 400);
  r = await change({ OldPassword: "matkhausai99", NewPassword: "matkhaumoi1" }, me);
  check("RQ-10  Mật khẩu hiện tại sai -> 400", r.status, 400);
  check("RQ-10  Thông báo lỗi rõ ràng khi sai mật khẩu hiện tại", r.body.message, "Old password is incorrect");
  r = await change({ OldPassword: valid.Password, NewPassword: "matkhaumoi1" }, me);
  check("RQ-10  Dữ liệu hợp lệ -> đổi thành công (200)", r.status, 200);
  r = await call(ctrl.login, { body: { Username: valid.Username, Password: valid.Password } });
  check("RQ-10  Đăng nhập bằng mật khẩu cũ bị từ chối -> 401", r.status, 401);
  r = await call(ctrl.login, { body: { Username: valid.Username, Password: "matkhaumoi1" } });
  check("RQ-10  Đăng nhập bằng mật khẩu mới thành công -> 200", r.status, 200);
  const stored = docs.find((d) => String(d._id) === id);
  check("RQ-10  Các thông tin khác (HoTen, Avatar, Email) giữ nguyên", [stored.HoTen, stored.Avatar, stored.Email].join("|"), "Nguyen Van A|1700000000-me.png|van@ctu.edu.vn");
  const ghost = "000000000000000000000077";
  r = await change({ OldPassword: "matkhaumoi1", NewPassword: "matkhauthu3" }, { id: ghost }, ghost);
  check("RQ-10  Tài khoản không tồn tại -> 404", r.status, 404);

  console.log(`\nTổng: ${passed + failed} | PASS: ${passed} | FAIL: ${failed}`);
  process.exit(failed ? 1 : 0);
})();
