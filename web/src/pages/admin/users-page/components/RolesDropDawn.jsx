import React from "react";

import UserService from "../../../../services/UserService";

const RolesDropDawn = ({ id, roles }) => {
  const onChangeRole = async (event) => {
    await UserService.changeRole(id, {
      name: event.target.value,
    });
  };

  return (
    <select onChange={onChangeRole}>
      {roles &&
        roles.map(({ name }) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
    </select>
  );
};

export default RolesDropDawn;
