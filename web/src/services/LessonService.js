import $host from "../axios";

export default class LessonService {
  static async teach(formData) {
    return await $host.post("/lesson/teach", formData, {
      responseType: "arraybuffer",
    });
  }

  static async continue() {
    return await $host.post(
      "/lesson/continue",
      {},
      {
        responseType: "arraybuffer",
      }
    );
  }

  static async create(structure) {
    return await $host.post(
      "/lesson",
      { structure },
      {
        responseType: "arraybuffer",
      }
    );
  }

  static async getStatus() {
    return await $host.get("/lesson/status");
  }

  static async stop() {
    return await $host.delete("/lesson");
  }
}
