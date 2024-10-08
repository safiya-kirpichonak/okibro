import React from "react";

import {
  PROFILE_ROUTE,
  PHRASAL_VERBS_LESSON_ROUTE,
  WISE_PROVERBS_LESSON_ROUTE,
  UNIVERSAL_EXPRESSIONS_ROUTE,
  INFINITY_CONVERSATION_LESSON_ROUTE,
} from "./const";
import LessonPage from "../pages/student/lesson-page";
import ProfilePage from "../pages/student/profile-page";

export const studentRoutes = [
  {
    path: INFINITY_CONVERSATION_LESSON_ROUTE,
    element: <LessonPage />,
  },
  {
    path: PHRASAL_VERBS_LESSON_ROUTE,
    element: <LessonPage />,
  },
  {
    path: WISE_PROVERBS_LESSON_ROUTE,
    element: <LessonPage />,
  },
  {
    path: UNIVERSAL_EXPRESSIONS_ROUTE,
    element: <LessonPage />,
  },
  {
    path: PROFILE_ROUTE,
    element: <ProfilePage />,
  },
  // {
  //   path: WALLET_ROUTE,
  //   element: <WalletPage />,
  // },
];
