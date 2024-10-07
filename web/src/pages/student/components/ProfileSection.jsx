import React from "react";

const ProfileSection = ({ userData }) => {
  return (
    <div
      className="single-schedule-area single-page d-flex flex-wrap justify-content-between align-items-center wow fadeInUp"
      data-wow-delay="300ms"
      style={{
        visibility: "visible",
        animationDelay: "300ms",
        animationName: "fadeInUp",
      }}
    >
      <div className="single-schedule-tumb-info d-flex align-items-center">
        {/* <div className="single-schedule-tumb">
          <img
            src={userData.image ? userData.image : "./theme/img/ava.svg"}
            alt=""
          />
        </div> */}
        <div className="single-schedule-info">
          <h6>{userData.name ? userData.name : "error"}</h6>
          <p>
            email: <span>{userData.email ? userData.email : "error"}</span>{" "}
          </p>
        </div>
      </div>
      <div className="schedule-time-place">
        <p>
          <i className="zmdi zmdi-time"></i> Date registered:{" "}
          {userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : "error"}
        </p>
        <p>
          <i className="zmdi zmdi-library"></i> Lessons passed:{" "}
          {userData.completedLessonsCount}
        </p>
        <p>
          <i className="zmdi zmdi-balance-wallet"></i> Credits available:{" "}
          {userData.credits}
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
