import React, { useState, useEffect } from "react";

import { StatusCodes } from "../../../helpers/http";
import WalletSection from "./components/WalletSection";
import UserService from "../../../services/UserService";
import Loading from "../../components/loading";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import ProfileSection from "../components/ProfileSection";

const WalletPage = () => {
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
              <div
                className="section-heading-2 text-center wow fadeInUp"
                data-wow-delay="300ms"
                style={{
                  visibility: "visible",
                  animationDelay: "300ms",
                  animationName: "fadeInUp",
                }}
              >
                <p>CHOOSE A LESSON</p>
                <h4 style={{ color: "black" }}>LESSONS PRICING</h4>
                <div style={{ margin: "40px 0 0 0" }}>
                  <WalletSection />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default WalletPage;
