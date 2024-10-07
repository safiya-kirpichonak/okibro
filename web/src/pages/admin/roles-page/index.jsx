import React, { useState, useEffect } from "react";

import RolesCard from "./components/RolesCard";
import { StatusCodes } from "../../../helpers/http";
import Loading from "../../components/loading";
import NavBar from "../../components/navbar";
import RolesService from "../../../services/RolesService";
import UserService from "../../../services/UserService";
import Footer from "../../components/footer";

const RolesPage = () => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoles = async () => {
    const userResponse = await UserService.getUser();
    const roleResponse = await RolesService.getRoles();
    if (
      userResponse.status === StatusCodes.OK &&
      roleResponse.status === StatusCodes.OK
    ) {
      setRole(userResponse.data.data.role.name);
      setRoles(roleResponse.data.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
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
            <h1 style={{ margin: "40px 0 0 0" }}>Roles</h1>
            <div style={{ margin: "40px 0 0 0" }}>
              {roles
                ? roles.map((user, index) => (
                    <RolesCard
                      name={user.name}
                      count={user.count}
                      key={index}
                    />
                  ))
                : "Not found"}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default RolesPage;
