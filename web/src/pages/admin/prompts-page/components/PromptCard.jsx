import React, { useState } from "react";

import { StatusCodes } from "../../../../helpers/http";
import PromptService from "../../../../services/PromptService";
import MainButton from "../../../components/main-button";

const PromptCard = ({ prompt }) => {
  const [content, setContent] = useState(prompt.content);

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onClickUpdate = async () => {
    const response = await PromptService.update(prompt.id, {
      content,
    });
    if (response.status === StatusCodes.OK) window.location.reload();
  };

  return (
    <div className="single-schedule-area single-page">
      <p>{prompt.code}</p>

      <textarea
        type="text"
        name="content"
        value={content}
        placeholder="Content"
        className="form-control"
        onChange={onChangeContent}
        style={{ margin: "12px 0 12px 0" }}
      ></textarea>

      <div style={{ display: "flex", flexFlow: "row wrap" }}>
        <div style={{ margin: "0 20px 0 0" }}>
          {" "}
          <MainButton text="Update" onClick={onClickUpdate} />
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
