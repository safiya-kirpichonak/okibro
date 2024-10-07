/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Footer from "../../components/footer";
import NavBar from "../../components/navbar";
import AuthService from "../../../services/AuthService";
import { LOGIN_ROUTE } from "../../../routes/const";
import { StatusCodes } from "../../../helpers/http";

const ConfirmationPage = () => {
  const { token } = useParams();
  const [text, setText] = useState("");

  const setConfirmEmail = async () => {
    if (token === "progress") {
      setText("An e-mail was sent to you. Please, confirm your email.");
    } else {
      const response = await AuthService.confirmEmail(token);
      if (response.status === StatusCodes.OK) {
        setText("OK! Please, login.");
      } else {
        setText("Error! Please, try again letter!");
      }
      window.location.href = LOGIN_ROUTE;
    }
  };

  useEffect(() => {
    setConfirmEmail();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container">
        <div style={{ margin: "80px 0 80px 0" }}>
          <h1 style={{ textAlign: "center" }}>{text}</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmationPage;
