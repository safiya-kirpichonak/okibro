/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import React, { useState } from "react";

import { validationNewPassword } from "./formik";
import { StatusCodes } from "../../../../helpers/http";
import { LOGIN_ROUTE } from "../../../../routes/const";
import MainButton from "../../../components/main-button";
import AuthService from "../../../../services/AuthService";

const UpdatePasswordSection = ({ token }) => {
  const [resultText, setResultText] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const formikNewPassword = useFormik({
    initialValues: { newPassword: "" },
    validationSchema: validationNewPassword,
    onSubmit: async ({ newPassword }) => {
      const response = await AuthService.forgotPasswordUpdatePassword(
        token,
        newPassword
      );
      if (response.status === StatusCodes.OK) {
        setResultText("OK! Please, login.");
      } else {
        setResultText("Error! Please, try again later!");
      }
      window.location.href = LOGIN_ROUTE;
    },
  });

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      {resultText ? (
        <div style={{ margin: "80px 0 80px 0" }}>
          <h1 style={{ textAlign: "center" }}>{resultText}</h1>
        </div>
      ) : (
        <div>
          <h1>Create new password</h1>
          <div className="single-schedule-area single-page d-flex flex-wrap">
            {formikNewPassword.touched.newPassword &&
              formikNewPassword.errors.newPassword && (
                <div>
                  <p className="error-form">
                    {formikNewPassword.errors.newPassword}
                  </p>
                </div>
              )}
            <input
              type={isShowPassword ? "text" : "password"}
              name="newPassword"
              className="form-control"
              placeholder="Write your password"
              onBlur={formikNewPassword.handleBlur}
              onChange={formikNewPassword.handleChange}
              value={formikNewPassword.values.newPassword}
              style={{ margin: "12px 0 12px 0" }}
            />
            <MainButton text="Send" onClick={formikNewPassword.handleSubmit} />
            <MainButton
              style={{ marginLeft: "20px" }}
              onClick={() => setIsShowPassword(!isShowPassword)}
              text={isShowPassword ? "Hide password" : "Show Password"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePasswordSection;
