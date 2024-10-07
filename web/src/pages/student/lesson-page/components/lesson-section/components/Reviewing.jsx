/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";

import "../style.css";
import ExitClassAction from "../../exit-class";
import { createAnimationForEye } from "../services";
import OkibroEyeMobile from "../../okibro-eye-mobile";
import handleZipFile from "../services/handleZipFile";
import { MAX_MOBILE_SIZE } from "../../../../../../const";
import { StatusCodes } from "../../../../../../helpers/http";
import audioFiles from "../../../../../../data/audioPath.json";
import okibroMessages from "../../../../../../data/messages.json";
import LessonService from "../../../../../../services/LessonService";

const Reviewing = ({ setLessonState, response }) => {
  const audioRef = useRef(null);
  const [urls, setUrls] = useState([]);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [clicked, setClicked] = useState(false);
  const [errors, setErrorsTexts] = useState([]);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const [audioElement, setAudioElement] = useState(null);
  const [isAudioPermissionError, setIsAudioPermissionError] = useState(false);

  const startReviewing = async () => {
    if (response) {
      const errors = JSON.parse(response.headers["speech-text"]);
      const urls = await handleZipFile(response.data);
      setErrorsTexts(errors);
      setText(errors[index]);
      setAudioUrl(urls[index]);
      setUrls(urls);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.src = audioUrl;

      const handlePlay = () => {
        setIsButtonVisible(false);
      };

      const handleEnded = () => {
        if (!clicked) {
          setClicked(true);
          startReviewing();
        } else {
          audioElement.src = null;
          setAudioUrl(null);
          setIsButtonVisible(true);
        }
      };

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("ended", handleEnded);

      setIsButtonVisible(false);
      audioElement.play().catch((error) => {
        if (error.name === "NotAllowedError") {
          setAudioElement(audioElement);
          setIsAudioPermissionError(true);
          setText(okibroMessages["audio-permission-error"]);
        } else {
          setText(okibroMessages["internal-server-error"]);
        }
      });

      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  };

  const next = async () => {
    const presentIndex = index + 1;
    setIndex(presentIndex);
    if (presentIndex < errors.length) {
      setText(errors[presentIndex]);
      setAudioUrl(urls[presentIndex]);
    } else {
      setIsButtonVisible(false);
      const response = await LessonService.continue();
      if (response.status === StatusCodes.OK) {
        const state = response.headers["lesson-status"];
        setLessonState(state, response);
      } else {
        setText(okibroMessages["internal-server-error"]);
      }
    }
  };

  const drawEye = () => {
    if (window.innerWidth > MAX_MOBILE_SIZE) createAnimationForEye();
    const { words, path } = audioFiles["reviewing"];
    setAudioUrl(path);
    setText(words);
  };

  const setClickSpace = () => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") setIsSpacePressed((prevState) => !prevState);
    };

    window.addEventListener("keyup", handleKeyDown);

    return () => {
      window.removeEventListener("keyup", handleKeyDown);
    };
  };

  const setStartByClickingSpace = () => {
    if (isButtonVisible) next();
  };

  const startAudioManually = () => {
    audioElement.play();
    setIsAudioPermissionError(false);
    setText(errors[index] ? errors[index] : audioFiles["reviewing"].words);
  };

  useEffect(drawEye, []);
  useEffect(setClickSpace, []);
  useEffect(playAudio, [audioUrl]);
  useEffect(setStartByClickingSpace, [isSpacePressed]);

  return (
    <div className="body">
      {audioUrl && <audio ref={audioRef} controls className="hide-player" />}
      {isButtonVisible && (
        <div className="components">
          <div className="user">
            <span className="user__btn" onClick={next}>
              NEXT
            </span>
            <span className="user__back-1"></span>
            <span className="user__back-2"></span>
          </div>
        </div>
      )}
      <div className="section stop">
        <div
          className="okibro"
          onClick={isAudioPermissionError ? startAudioManually : undefined}
        >
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

export default Reviewing;
