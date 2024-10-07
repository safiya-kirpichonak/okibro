import React from "react";

import "./style.css";
import okibroMessages from "../../../../../data/messages.json";
import LessonService from "../../../../../services/LessonService";

const ExitClassAction = () => {
  const handleClick = async () => {
    const userConfirmed = window.confirm(
      okibroMessages["exit-lesson-confirmation"]
    );
    if (userConfirmed) {
      await LessonService.stop();
      window.location.href = "/";
    }
  };

  return (
    <div className="exit-class__section">
      <div className="exit-class__link" onClick={handleClick}>
        <i className="zmdi zmdi-long-arrow-tab"></i>
      </div>
    </div>
  );
};

export default ExitClassAction;
