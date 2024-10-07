/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { StatusCodes } from "../../../helpers/http";
import UserService from "../../../services/UserService";
import Loading from "../../components/loading";
import StudentSection from "./components/StudentSection";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import {
  USERS_ROUTE,
  INTERNAL_SERVER_ERROR_ROUTE,
} from "../../../routes/const";

const HomePage = () => {
  const [role, setRole] = useState("default");
  const [loading, setLoading] = useState(true);

  const getUserRole = async () => {
    const response = await UserService.getUser();
    if (response.status === StatusCodes.OK) {
      const userRole = response.data.data.role.name;
      if (userRole === "admin") {
        window.location.href = USERS_ROUTE;
      } else {
        setRole(userRole);
        setLoading(false);
      }
    }
  };

  const getUserSection = (role) => {
    if (role === "student") return <StudentSection />;
    window.location.href = INTERNAL_SERVER_ERROR_ROUTE;
  };

  useEffect(() => {
    getUserRole();
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <NavBar role={role} />
          <div>{getUserSection(role)}</div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default HomePage;
