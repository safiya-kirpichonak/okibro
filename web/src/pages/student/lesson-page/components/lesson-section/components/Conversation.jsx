/* eslint-disable react-hooks/exhaustive-deps */
import MicRecorder from "mic-recorder-to-mp3";
import React, { useEffect, useState, useRef } from "react";

import "../style.css";
import ExitClassAction from "../../exit-class";
import OkibroEyeMobile from "../../okibro-eye-mobile";
import { MAX_MOBILE_SIZE } from "../../../../../../const";
import { StatusCodes } from "../../../../../../helpers/http";
import audioFiles from "../../../../../../data/audioPath.json";
import okibroMessages from "../../../../../../data/messages.json";
import LessonService from "../../../../../../services/LessonService";
import { createAudioFormData, createAnimationForEye } from "../services";

const Conversation = ({ setLessonState, response }) => {
  const [conversationStyle, setConversationStyle] = useState({
    userStyle: "user",
    playStyle: "play",
    pauseStyle: "pause",
    sectionStyle: "section stop",
    wave1Style: "user__back-1",
    wave2Style: "user__back-2",
    playButtonStyle: "user__btn",
    isPlayVisibleStyle: true,
  });

  const setStyles = (isUserRecording) => {
    if (isUserRecording) {
      setConversationStyle({
        userStyle: "user",
        playStyle: "play",
        pauseStyle: "pause",
        sectionStyle: "section",
        wave1Style: "user__back-1",
        wave2Style: "user__back-2",
        playButtonStyle: "user__btn",
        isPlayVisibleStyle: false,
      });
    } else {
      setConversationStyle({
        userStyle: "user stop",
        playStyle: "play visibility",
        pauseStyle: "pause visibility",
        sectionStyle: "section stop",
        wave1Style: "user__back-1 paused",
        wave2Style: "user__back-2 paused",
        playButtonStyle: "user__btn shadow",
        isPlayVisibleStyle: true,
      });
    }
  };

  const audioRef = useRef(null);
  const [seconds, setSeconds] = useState(30);
  const [audioUrl, setAudioUrl] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const [randomElement, setRandomElement] = useState(null);
  const [loadingTimerId, setLoadingTimerId] = useState(null);

  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const [text, setText] = useState(okibroMessages["continue-speak"]);
  const [recorder, setRecorder] = useState(new MicRecorder({ bitRate: 128 }));

  const [audioElement, setAudioElement] = useState(null);
  const [internalResponse, setInternalResponse] = useState(null);
  const [isAudioPermissionError, setIsAudioPermissionError] = useState(false);

  const start = async () => {
    if (!audioUrl) {
      try {
        await recorder.start();
        setRecorder(recorder);
        setIsRunning(true);
        setStyles(true);
      } catch (error) {
        setIsRunning(false);
        setRecorder(new MicRecorder({ bitRate: 128 }));
        setText(okibroMessages["internal-server-error"]);
      }
    }
  };

  const stop = async () => {
    if (seconds < 29) {
      try {
        if (seconds < 20) {
          const { loadingAudio } = audioFiles;
          const randomIndex = Math.floor(Math.random() * loadingAudio.length);
          const randomElement = loadingAudio[randomIndex];
          setAudioUrl(randomElement.path);
          setRandomElement(randomElement);
        }
        setIsButtonVisible(false);
        setIsRunning(false);
        setStyles(false);
        setSeconds(30);

        const [buffer, blob] = await recorder.stop().getMp3();
        setRecorder(recorder);

        const response = await LessonService.teach(
          createAudioFormData(buffer, blob)
        );

        if (response.status === StatusCodes.OK) {
          const state = response.headers["lesson-status"];
          setLessonState(state, response);
        } else {
          setText(okibroMessages["internal-server-error"]);
        }
      } catch (error) {
        setAudioUrl(null);
        setRecorder(new MicRecorder({ bitRate: 128 }));
        setText(okibroMessages["internal-server-error"]);
      }
    }
  };

  const setResponse = async (response) => {
    if (window.innerWidth > MAX_MOBILE_SIZE) createAnimationForEye();

    if (response) {
      setInternalResponse(response);
      setRandomElement(null);
      clearTimeout(loadingTimerId);
      setText(response.headers["speech-text"]);
      const speech = new Blob([response.data], { type: "audio/mpeg" });
      const audioBlobUrl = URL.createObjectURL(speech);
      setAudioUrl(audioBlobUrl);
    } else {
      const response = await LessonService.continue();
      if (response.status === StatusCodes.OK) {
        setInternalResponse(response);
        const speech = new Blob([response.data], { type: "audio/mpeg" });
        const audioBlobUrl = URL.createObjectURL(speech);
        setText(response.headers["speech-text"]);
        setAudioUrl(audioBlobUrl);
      } else {
        setText(okibroMessages["internal-server-error"]);
      }
    }
  };

  const setTimer = () => {
    let interval;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    if (seconds === 0 && isRunning) {
      stop();
    }

    return () => {
      clearInterval(interval);
    };
  };

  const setAudio = () => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.src = audioUrl;

      const handlePlay = () => {
        setIsButtonVisible(false);
      };

      const handleEnded = () => {
        audioElement.src = null;
        setAudioUrl(null);
        if (!randomElement) setIsButtonVisible(true);
      };

      const startLoadingSpeech = () => {
        setText(randomElement.words);
        audioElement.play().catch((error) => {
          if (error.name === "NotAllowedError") {
            setAudioElement(audioElement);
            setIsAudioPermissionError(true);
            setText(okibroMessages["audio-permission-error"]);
          } else {
            setText(okibroMessages["internal-server-error"]);
          }
        });
      };

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("ended", handleEnded);

      let timerId;
      if (randomElement) {
        timerId = setTimeout(startLoadingSpeech, 3000);
        setLoadingTimerId(timerId);
      } else {
        audioElement.play().catch((error) => {
          if (error.name === "NotAllowedError") {
            setAudioElement(audioElement);
            setIsAudioPermissionError(true);
            setText(okibroMessages["audio-permission-error"]);
          } else {
            setText(okibroMessages["internal-server-error"]);
          }
        });
      }

      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("ended", handleEnded);
        clearTimeout(timerId);
      };
    }
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
    if (isRunning) {
      stop();
    } else {
      if (isButtonVisible) {
        start();
      }
    }
  };

  const startAudioManually = () => {
    audioElement.play();
    setIsAudioPermissionError(false);
    setText(internalResponse.headers["speech-text"]);
  };

  useEffect(() => {
    setResponse(response);
  }, [response]);
  useEffect(setClickSpace, []);
  useEffect(setAudio, [audioUrl]);
  useEffect(setTimer, [seconds, isRunning]);
  useEffect(setStartByClickingSpace, [isSpacePressed]);

  return (
    <div className="body">
      {audioUrl && <audio ref={audioRef} controls className="hide-player" />}
      {isButtonVisible && (
        <div className="components">
          <div className={conversationStyle.userStyle}>
            <span className={conversationStyle.playButtonStyle}>
              {conversationStyle.isPlayVisibleStyle ? (
                <ion-icon
                  name="play"
                  onClick={start}
                  className={conversationStyle.playStyle}
                ></ion-icon>
              ) : (
                <span
                  className={conversationStyle.pauseStyle}
                  id="time"
                  onClick={stop}
                >
                  {seconds}
                </span>
              )}
            </span>
            <span className={conversationStyle.wave1Style}></span>
            <span className={conversationStyle.wave2Style}></span>
          </div>
        </div>
      )}
      <div className={conversationStyle.sectionStyle}>
        <div
          className="okibro"
          onClick={isAudioPermissionError ? startAudioManually : undefined}
        >
          <canvas id="canvas"></canvas>
          <OkibroEyeMobile />
          <div className="cute_okibro_face">
            <div className="cute_mouth_okibro">
              <h2 className="stop">{text}</h2>
            </div>
          </div>
        </div>
      </div>
      <ExitClassAction />
    </div>
  );
};

export default Conversation;
