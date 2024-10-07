/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";

import "../style.css";
import ExitClassAction from "../../exit-class";
import { createAnimationForEye } from "../services";
import OkibroEyeMobile from "../../okibro-eye-mobile";
import { MAX_MOBILE_SIZE } from "../../../../../../const";
import { StatusCodes } from "../../../../../../helpers/http";
import audioFiles from "../../../../../../data/audioPath.json";
import okibroMessages from "../../../../../../data/messages.json";
import LessonService from "../../../../../../services/LessonService";

const Introduction = ({ setLessonState }) => {
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [clicked, setClicked] = useState(false);
  const [structure, setStructure] = useState("");
  const [text, setText] = useState("Click me to start!");

  useEffect(() => {
    if (window.innerWidth > MAX_MOBILE_SIZE) createAnimationForEye();

    const structure = window.location.href.split("/")[3];
    setStructure(structure);

    if (structure === "infinity-conversation-lesson") {
      const { path } = audioFiles["infinity-conversation-lesson-introduction"];
      setAudioUrl(path);
    }

    if (structure === "phrasal-verbs-lesson") {
      const { path } = audioFiles["phrasal-verbs-lesson-introduction"];
      setAudioUrl(path);
    }

    if (structure === "wise-proverbs-lesson") {
      const { path } = audioFiles["wise-proverbs-lesson-introduction"];
      setAudioUrl(path);
    }

    if (structure === "universal-expressions-lesson") {
      const { path } = audioFiles["universal-expressions-lesson-introduction"];
      setAudioUrl(path);
    }
  }, []);

  const handleEnded = async () => {
    const response = await LessonService.create(structure);
    if (response.status === StatusCodes.OK) {
      const state = response.headers["lesson-status"];
      setLessonState(state, response);
    } else {
      setText(okibroMessages["internal-server-error"]);
    }
  };

  const introduction = async () => {
    if (!clicked) {
      setClicked(true);

      if (structure === "infinity-conversation-lesson") {
        const { words } =
          audioFiles["infinity-conversation-lesson-introduction"];
        setText(words);
      }

      if (structure === "wise-proverbs-lesson") {
        const { words } = audioFiles["wise-proverbs-lesson-introduction"];
        setText(words);
      }

      if (structure === "universal-expressions-lesson") {
        const { words } =
          audioFiles["universal-expressions-lesson-introduction"];
        setText(words);
      }

      if (structure === "phrasal-verbs-lesson") {
        const { words } = audioFiles["phrasal-verbs-lesson-introduction"];
        setText(words);
      }

      if (audioRef.current) {
        const audioElement = audioRef.current;
        audioElement.src = audioUrl;
        audioElement.addEventListener("ended", handleEnded);
        audioElement.play();
      }
    }
  };

  return (
    <div className="body">
      {audioUrl && <audio ref={audioRef} controls className="hide-player" />}
      <div className="section stop">
        <div className="okibro" onClick={introduction}>
          <canvas id="canvas"></canvas>
          <OkibroEyeMobile />
          <div className="cute_okibro_face">
            <div className="cute_mouth_okibro">
              <h2>{text}</h2>
            </div>
          </div>
        </div>
      </div>
      <ExitClassAction />
    </div>
  );
};

export default Introduction;
