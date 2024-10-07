import axios from "axios";

import { AXIOS } from "../config";
import { StatusCodes } from "../helpers/http";
import {
  LOGIN_ROUTE,
  FORBIDDEN_ROUTE,
  INTERNAL_SERVER_ERROR_ROUTE,
} from "../routes/const";

const $host = axios.create(AXIOS);

$host.interceptors.request.use((config) => {
  const authorization = `Bearer ${sessionStorage.getItem("access-token")}`;
  config.headers.Authorization = authorization;
  return config;
});

$host.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response.status === StatusCodes.UNAUTHORIZED;
    const shouldRetry = originalRequest && !originalRequest._isRetry;

    if (isUnauthorized && shouldRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}auth/refresh`,
          { withCredentials: true }
        );
        const newAccessToken = response.data.accessToken;
        sessionStorage.setItem("access-token", newAccessToken);
        return $host.request(originalRequest);
      } catch (error) {
        window.location.href = LOGIN_ROUTE;
      }
    }

    if (error.response.status === StatusCodes.FORBIDDEN)
      window.location.href = FORBIDDEN_ROUTE;

    if (error.response.status === StatusCodes.INTERNAL_SERVER_ERROR)
      window.location.href = INTERNAL_SERVER_ERROR_ROUTE;

    return error;
  }
);

export default $host;
