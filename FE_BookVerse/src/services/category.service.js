import createApiClient from "./api.service";

class CategoryService {
  constructor(baseUrl = "/api/category") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
}

export default new CategoryService();
