import React, { useState, useEffect } from "react";

import { StatusCodes } from "../../../helpers/http";
import Loading from "../../components/loading";
import UserService from "../../../services/UserService";
import Footer from "../../components/footer";
import NavBar from "../../components/navbar";
import ReportsSection from "./components/ReportsSection";

const ReportsPage = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const getRole = async () => {
    const response = await UserService.getUser();
    if (response.status === StatusCodes.OK) {
      setRole(response.data.data.role.name);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRole();
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
            <section className="our-schedule-area bg-white section-padding-100">
              <h1 style={{ margin: "0 0 40px 0" }}>Reports</h1>
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="tab-content" id="conferScheduleTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="step-one"
                        role="tabpanel"
                        aria-labelledby="monday-tab"
                      >
                        <ReportsSection />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
