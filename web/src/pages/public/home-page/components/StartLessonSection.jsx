import React from "react";

import MainButton from "../../../components/main-button";

const StartLessonSection = (data) => {
  return (
    <div
      className="single-schedule-area single-page d-flex flex-wrap justify-content-between align-items-center wow fadeInUp"
      data-wow-delay="300ms"
    >
      <div className="single-schedule-tumb-info d-flex align-items-center">
        {/* <div className="single-schedule-tumb"></div> */}
        <div className="single-schedule-info">
          <h6>{data.name}</h6>
          <p>{data.description}</p>
        </div>
      </div>
      <div className="schedule-time-place">
        <p>
          <i className="zmdi zmdi-time"></i> {data.duration}
        </p>
        <p>
          <i className="zmdi zmdi-map"></i>
          {data.credits}{" "}
        </p>
      </div>
      <MainButton text={data.button.text} onClick={data.button.onClick} />
    </div>
  );
};

export default StartLessonSection;
