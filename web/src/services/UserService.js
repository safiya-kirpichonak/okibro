import $host from "../axios";

export default class UserService {
  static async getUsers() {
    return await $host.get("/users");
  }

  static async getUser() {
    return await $host.get("/users/get");
  }

  static async changePassword(body) {
    return await $host.put("/users/password", body);
  }

  static async changeIsActiveStatus(id) {
    return await $host.put(`/users/is-active/${id}`);
  }

  static async changeRole(id, body) {
    return await $host.put(`/users/role/${id}`, body);
  }
}
