import React from "react";

import RolesPage from "../pages/admin/roles-page";
import UsersPage from "../pages/admin/users-page";
import PromptsPage from "../pages/admin/prompts-page";
import ReportsPage from "../pages/admin/reports-page";
import { PROMPTS_ROUTE, ROLES_ROUTE, USERS_ROUTE, REPORT_ROUTE } from "./const";

export const adminRoutes = [
  {
    path: ROLES_ROUTE,
    element: <RolesPage />,
  },
  {
    path: USERS_ROUTE,
    element: <UsersPage />,
  },
  {
    path: REPORT_ROUTE,
    element: <ReportsPage />,
  },
  {
    path: PROMPTS_ROUTE,
    element: <PromptsPage />,
  },
];
