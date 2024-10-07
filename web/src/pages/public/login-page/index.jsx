import React, { useState } from "react";

import "./style.css";
import LoginSection from "./components/LoginSection";

const LoginPage = () => {
  const [backgroundColor, setBackgroundColor] = useState(false);

  return (
    <div className={backgroundColor ? "blue-bg" : "pink-bg"}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <LoginSection setBackgroundColor={setBackgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
