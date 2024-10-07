import React from "react";

const RolesCard = ({ name, count }) => {
  return (
    <div className="single-schedule-area single-page">
      <div style={{ display: "flex", flexFlow: "row wrap" }}>
        <p style={{ margin: "0 20px 0 20px" }}>
          <b>{name}</b> : {count}
        </p>
      </div>
    </div>
  );
};

export default RolesCard;
