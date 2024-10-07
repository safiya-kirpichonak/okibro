import React, { useState, useEffect } from "react";

import UsersCard from "./components/UsersCard";
import { StatusCodes } from "../../../helpers/http";
import UserService from "../../../services/UserService";
import Loading from "../../components/loading";
import NavBar from "../../components/navbar";
import RolesService from "../../../services/RolesService";
import Footer from "../../components/footer";

const UsersPage = () => {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const getData = async () => {
    const userResponse = await UserService.getUser();
    const rolesResponse = await RolesService.getRoles();
    const usersResponse = await UserService.getUsers();
    if (
      userResponse.status === StatusCodes.OK &&
      rolesResponse.status === StatusCodes.OK &&
      usersResponse.status === StatusCodes.OK
    ) {
      setRole(userResponse.data.data.role.name);
      setRoles(rolesResponse.data.data);
      setUsers(usersResponse.data.data);
      setFilteredUsers(usersResponse.data.data);
      setLoading(false);
    }
  };

  const onChangeSearch = async (e) => {
    const searchTerm = e.target.value;
    const filteredUsers = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setSearchTerm(searchTerm);
    setFilteredUsers(filteredUsers);
  };

  const onClickBlock = async (id) => {
    await UserService.changeIsActiveStatus(id);
    window.location.reload();
  };

  useEffect(() => {
    getData();
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
            <h1 style={{ margin: "40px 0 0 0" }}>Users</h1>
            <input
              type="text"
              style={{ margin: "20px 0 0 0" }}
              className="form-control"
              value={searchTerm}
              placeholder="Write name or email"
              onChange={onChangeSearch}
            />
            <div style={{ margin: "40px 0 0 0" }}>
              {filteredUsers
                ? filteredUsers.map((user, index) => (
                    <UsersCard
                      id={user.id}
                      key={index}
                      roles={roles}
                      name={user.name}
                      image={user.image}
                      email={user.email}
                      role={user.role.name}
                      isActive={user.isActive}
                      lessonsCount={user.lessonsCount}
                      completedLessonsCount={user.completedLessonsCount}
                      onClickBlock={async () => await onClickBlock(user.id)}
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

export default UsersPage;
