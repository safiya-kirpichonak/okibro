import $host from "../axios";
import { StatusCodes } from "../helpers/http";

export default class AuthService {
  static async loginLocal(email, password) {
    const body = { email, password };
    const response = await $host.post("/auth/local/login", body);
    if (response.status === StatusCodes.OK)
      sessionStorage.setItem("access-token", response.data.accessToken);
    return response;
  }

  static async signUpLocal(name, email, password) {
    return await $host.post("/auth/local/signup", {
      name,
      email,
      password,
    });
  }

  static async confirmEmail(token) {
    return await $host.post("/auth/local/confirm", { token });
  }

  static async forgotPasswordSendEmail(email) {
    return await $host.post("/auth/forgot-password/email", { email });
  }

  static async forgotPasswordUpdatePassword(token, password) {
    return await $host.post("/auth/forgot-password/new", { token, password });
  }

  static async loginGoogle(token) {
    const response = await $host.post("/auth/google/login", { token });
    if (response.status === StatusCodes.OK)
      sessionStorage.setItem("access-token", response.data.accessToken);
    return response;
  }

  static async logout() {
    await $host.post("/auth/logout");
    sessionStorage.removeItem("access-token");
  }
}
