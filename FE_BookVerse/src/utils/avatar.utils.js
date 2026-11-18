// RQ-09: tiện ích dựng URL ảnh đại diện (dùng chung cho ProfileEdit, ProfileSidebar, HeaderUser)
// Ảnh được Backend phục vụ tĩnh tại /api/upload/<tên file> (cùng thư mục với ảnh bìa sách)
export function getAvatarUrl(filename, fallback) {
  if (!filename) return fallback;
  return `/api/upload/${encodeURIComponent(filename)}`;
}
