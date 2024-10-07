import React, { useState } from "react";

import { StatusCodes } from "../../../../helpers/http";
import PromptService from "../../../../services/PromptService";
import MainButton from "../../../components/main-button";

const CreatePromptSection = () => {
  const [code, setCode] = useState("");
  const [content, setContent] = useState("");

  const onChangeCode = (e) => {
    setCode(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onClickCreate = async () => {
    const response = await PromptService.create({ code, content });
    if(response.status === StatusCodes.OK){
      setCode("");
      setContent("");
      window.location.reload();
    }
  };

  return (
    <div className="single-schedule-area single-page d-flex flex-wrap">
      <input
        value={code}
        type="text"
        name="code"
        placeholder="Code"
        className="form-control"
        onChange={onChangeCode}
        style={{ margin: "12px 0 12px 0" }}
      />

      <textarea
        type="text"
        name="content"
        value={content}
        placeholder="Content"
        className="form-control"
        onChange={onChangeContent}
        style={{ margin: "12px 0 12px 0" }}
      ></textarea>

      <div style={{ marginLeft: "20px" }}>
        <MainButton text="Create" onClick={onClickCreate} />
      </div>
    </div>
  );
};

export default CreatePromptSection;
