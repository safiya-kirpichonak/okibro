import React from "react";
import { Route, Routes } from "react-router-dom";

import { adminRoutes } from "./admin";
import { publicRoutes } from "./public";
import { studentRoutes } from "./student";
import { StatusCodes } from "../helpers/http";
import ErrorPage from "../pages/public/error-page";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        {studentRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {adminRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route
          path="/*"
          element={<ErrorPage status={StatusCodes.NOT_FOUND} />}
        />
      </Routes>
    </div>
  );
};

export default AppRouter;
