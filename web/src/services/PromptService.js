import $host from "../axios";

export default class PromptService {
  static async getList() {
    return await $host.get("/prompts");
  }

  static async create(body) {
    return await $host.post("/prompts", body);
  }

  static async update(id, body) {
    return await $host.put(`/prompts/${id}`, body);
  }
}
