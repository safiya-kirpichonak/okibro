import React from "react";

import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  FORBIDDEN_ROUTE,
  NOT_FOUND_ROUTE,
  CONFIRMATION_ROUTE,
  UNAUTHORIZED_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  INTERNAL_SERVER_ERROR_ROUTE,
} from "./const";
import { StatusCodes } from "../helpers/http";
import HomePage from "../pages/public/home-page";
import ErrorPage from "../pages/public/error-page";
import LoginPage from "../pages/public/login-page";
import ConfirmationPage from "../pages/public/confirmation-page";
import ForgotPasswordPage from "../pages/public/forgot-password-page";

export const publicRoutes = [
  {
    path: HOME_ROUTE,
    element: <HomePage />,
  },
  {
    path: LOGIN_ROUTE,
    element: <LoginPage />,
  },
  {
    path: FORBIDDEN_ROUTE,
    element: <ErrorPage status={StatusCodes.FORBIDDEN} />,
  },
  {
    path: NOT_FOUND_ROUTE,
    element: <ErrorPage status={StatusCodes.NOT_FOUND} />,
  },
  {
    path: UNAUTHORIZED_ROUTE,
    element: <ErrorPage status={StatusCodes.UNAUTHORIZED} />,
  },
  {
    path: INTERNAL_SERVER_ERROR_ROUTE,
    element: <ErrorPage status={StatusCodes.INTERNAL_SERVER_ERROR} />,
  },
  {
    path: CONFIRMATION_ROUTE,
    element: <ConfirmationPage />,
  },
  {
    path: FORGOT_PASSWORD_ROUTE,
    element: <ForgotPasswordPage />,
  },
];
