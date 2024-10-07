import React from "react";

const MainButton = ({ text, onClick, style }) => {
  return (
    <button
      className="confer-btn"
      onClick={onClick}
      type="button"
      style={style}
    >
      {text}
    </button>
  );
};

export default MainButton;
