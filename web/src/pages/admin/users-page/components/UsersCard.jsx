import React from "react";

import RolesDropDawn from "./RolesDropDawn";
import MainButton from "../../../components/main-button";

const UsersCard = (data) => {
  return (
    <div className="single-schedule-area single-page">
      <div style={{ display: "flex", flexFlow: "row wrap" }}>
        <p style={{ margin: "0 20px 0 20px" }}>
          <b>
            {data.name}, {data.role}
          </b>
        </p>
        <p style={{ margin: "0 20px 0 20px" }}>
          <b>Email: </b>
          {data.email}
        </p>
        <p style={{ margin: "0 20px 0 20px" }}>
          <b>Lessons count:</b> {data.lessonsCount}
        </p>
        <p style={{ margin: "0 20px 0 20px" }}>
          <b>Completed lessons count:</b> {data.completedLessonsCount}
        </p>
      </div>
      <br />
      <div style={{ display: "flex", flexFlow: "row wrap" }}>
        <div style={{ margin: "0 20px 0 0" }}>
          {" "}
          <MainButton
            text={data.isActive ? "block" : "unblock"}
            onClick={data.onClickBlock}
          />
        </div>
        <RolesDropDawn id={data.id} roles={data.roles} />
      </div>
    </div>
  );
};

export default UsersCard;
