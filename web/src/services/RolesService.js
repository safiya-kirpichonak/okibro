import $host from "../axios";

export default class RolesService {
  static async getRoles() {
    return await $host.get("/roles");
  }
}
