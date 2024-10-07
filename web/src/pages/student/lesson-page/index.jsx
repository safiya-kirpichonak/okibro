/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import Loading from "../../components/loading";
import { HOME_ROUTE } from "../../../routes/const";
import { StatusCodes } from "../../../helpers/http";
import LessonSection from "./components/lesson-section";
import UserService from "../../../services/UserService";
import LessonService from "../../../services/LessonService";

const LessonPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLessonData = async () => {
    await UserService.getUser();
    const statusResponse = await LessonService.getStatus();
    if (statusResponse.status === StatusCodes.OK) {
      const structure = statusResponse.data.data.structure;
      const href = window.location.href.split("/")[3];

      if (!statusResponse.data.data.availableStructures.includes(href))
        window.location.href = HOME_ROUTE;

      if (structure !== href && structure !== "no-structure")
        window.location.href = `/${structure}`;

      setStatus(statusResponse.data.data.status);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLessonData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <LessonSection status={status} />
        </div>
      )}
    </div>
  );
};

export default LessonPage;
