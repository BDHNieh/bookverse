import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl) {
    this.api = createApiClient(baseUrl);
  }
  async getAll(data = {}) {
    return (await this.api.get("/", { params: data })).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
  async checkUsername(data = {}) {
    return (await this.api.get(`/check/`, { params: data })).data;
  }
  async login(data) {
    return (await this.api.post("/login", data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  // RQ-09: tải ảnh đại diện lên máy chủ, trả về { filename }
  async uploadAvatar(formData) {
    return (
      await this.api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  }
  // RQ-10: đổi mật khẩu, data = { OldPassword, NewPassword }
  async changePassword(id, data) {
    return (await this.api.put(`/${id}/password`, data)).data;
  }
}

export default new ReaderService("/api/reader");
