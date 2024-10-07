/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";

import "../style.css";
import ExitClassAction from "../../exit-class";
import { createAnimationForEye } from "../services";
import OkibroEyeMobile from "../../okibro-eye-mobile";
import { MAX_MOBILE_SIZE } from "../../../../../../const";
import { HOME_ROUTE } from "../../../../../../routes/const";
import audioFiles from "../../../../../../data/audioPath.json";
import LessonService from "../../../../../../services/LessonService";

const Summarizing = () => {
  const audioRef = useRef(null);
  const { path, words } = audioFiles["summarizing"];

  const summarizing = async () => {
    await LessonService.stop();
    const isOK = window.confirm(
      "Would you like to help us make Okibro better? Please answer the questions!"
    );

    if (isOK) {
      window.location.href = "https://forms.gle/orM6jv9PkU1CcDjY8";
    } else {
      window.location.href = HOME_ROUTE;
    }
  };

  useEffect(() => {
    if (window.innerWidth > MAX_MOBILE_SIZE) createAnimationForEye();
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", summarizing);
      audioRef.current.play().catch(summarizing);
    }
  }, []);

  return (
    <div className="body">
      <audio ref={audioRef}>
        <source src={path} type="audio/mpeg" />
      </audio>
      <div className="section stop">
        <div className="okibro">
          <canvas id="canvas" onClick={summarizing}></canvas>
          <OkibroEyeMobile />
          <div className="cute_okibro_face">
            <div className="cute_mouth_okibro">
              <h2>{words}</h2>
            </div>
          </div>
        </div>
      </div>
      <ExitClassAction />
    </div>
  );
};

export default Summarizing;
