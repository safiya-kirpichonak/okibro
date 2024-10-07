/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useParams } from "react-router-dom";

import Footer from "../../components/footer";
import NavBar from "../../components/navbar";
import SendEmailSection from "./components/SendEmailSection";
import UpdatePasswordSection from "./components/UpdatePasswordSection";

const ForgotPasswordPage = () => {
  const { token } = useParams();

  return (
    <div>
      <NavBar />
      {token === "email" ? (
        <SendEmailSection />
      ) : (
        <UpdatePasswordSection token={token} />
      )}
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
