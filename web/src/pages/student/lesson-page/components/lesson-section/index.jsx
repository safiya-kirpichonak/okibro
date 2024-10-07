import React, { useState, useEffect } from "react";

import "./style.css";

import Reviewing from "./components/Reviewing";
import Summarizing from "./components/Summarizing";
import Introduction from "./components/Introduction";
import Conversation from "./components/Conversation";

const LessonSection = ({ status }) => {
  const [state, setState] = useState("");
  const [response, setResponse] = useState(null);

  const setLessonState = (flag, response) => {
    setState(flag);
    setResponse(response);
  };

  useEffect(() => {
    if (status) setState(status);
  }, [status]);

  const components = {
    introduction: (
      <Introduction setLessonState={setLessonState} response={response} />
    ),
    conversation: (
      <Conversation setLessonState={setLessonState} response={response} />
    ),
    reviewing: (
      <Reviewing setLessonState={setLessonState} response={response} />
    ),
    summarizing: <Summarizing />,
  };

  return <div>{components[state]}</div>;
};

export default LessonSection;
