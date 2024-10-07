import React, { useEffect, useState } from "react";

import Loading from "../../components/loading";
import Footer from "../../components/footer";
import NavBar from "../../components/navbar";
import { StatusCodes } from "../../../helpers/http";
import UserService from "../../../services/UserService";
import ProfileSection from "../components/ProfileSection";
import ChangePasswordSection from "./components/ChangePasswordSection";

const ProfilePage = () => {
  const [role, setRole] = useState("default");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    const response = await UserService.getUser();
    if (response.status === StatusCodes.OK) {
      const userData = response.data.data;
      const userRole = response.data.data.role.name;
      setRole(userRole);
      setUserData(userData);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
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
          <div className="container">
            <div style={{ margin: "40px 0 40px 0" }}>
              <ProfileSection userData={userData} />
            </div>
            <div style={{ margin: "40px 0 40px 0" }}>
              <ChangePasswordSection />
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
