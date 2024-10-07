import { useFormik } from "formik";
import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import "./style.css";
import { StatusCodes } from "../../../../helpers/http";
import MainButton from "../../../components/main-button";
import AuthService from "../../../../services/AuthService";
import { validationLogIn, validationSignUp } from "./formik";
import {
  HOME_ROUTE,
  FORGOT_PASSWORD_EMAIL,
  START_CONFIRMATION_ROUTE,
} from "../../../../routes/const";

const LoginSection = ({ setBackgroundColor }) => {
  const [error, setError] = useState("");
  const [isFormActive, setIsFormActive] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isSignUpButtonClicked, setIsSignUpButtonClicked] = useState(false);

  const handleSignupClick = () => {
    setIsFormActive(true);
    setBackgroundColor(true);
    formikLogin.resetForm();
    formikSignUp.resetForm();
  };

  const handleSigninClick = () => {
    setIsFormActive(false);
    setBackgroundColor(false);
    formikLogin.resetForm();
    formikSignUp.resetForm();
  };

  const googleLogIn = async ({ credential }) => {
    const response = await AuthService.loginGoogle(credential);
    if (response.status === StatusCodes.OK) {
      window.location.href = HOME_ROUTE;
    } else {
      if (response.response.status === StatusCodes.BAD_REQUEST) {
        setError(response.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const showPassword = () => setIsShowPassword(!isShowPassword);

  const formikLogin = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationLogIn,
    onSubmit: async ({ email, password }) => {
      const response = await AuthService.loginLocal(email, password);
      if (response.status === StatusCodes.OK) {
        window.location.href = HOME_ROUTE;
      } else {
        if (response.response.status === StatusCodes.BAD_REQUEST) {
          setError(response.response.data.message);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
      formikLogin.resetForm();
    },
  });

  const formikSignUp = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: validationSignUp,
    onSubmit: async ({ name, email, password }) => {
      setIsSignUpButtonClicked(true);
      const response = await AuthService.signUpLocal(name, email, password);
      if (response.status === StatusCodes.OK) {
        window.location.href = START_CONFIRMATION_ROUTE;
      } else {
        setIsSignUpButtonClicked(false);
        if (response.response.status === StatusCodes.BAD_REQUEST) {
          setError(response.response.data.message);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
      formikLogin.resetForm();
    },
  });

  return (
    <div className="container-login">
      <div className={"blueBg"}>
        <div className="box signin">
          <h2>Already have account?</h2>
          <button className="signinBtn" onClick={handleSigninClick}>
            SIGN IN
          </button>
        </div>
        <div className="box signup">
          <h2>Dont have account?</h2>
          <button className="signupBtn" onClick={handleSignupClick}>
            SIGN UP
          </button>
        </div>
      </div>
      <div className={isFormActive ? "formBx active" : "formBx"}>
        <div className="form signinForm">
          <h1>Sign in</h1>
          <p className="error-form">{error}</p>
          {formikLogin.touched.email && formikLogin.errors.email && (
            <div>
              <p className="error-form">{formikLogin.errors.email}</p>
            </div>
          )}
          <input
            style={{ margin: "0 0 20px 0" }}
            className="input-login"
            onChange={formikLogin.handleChange}
            onBlur={formikLogin.handleBlur}
            value={formikLogin.values.email}
            name="email"
            placeholder="Email"
            type="text"
          />
          {formikLogin.touched.password && formikLogin.errors.password && (
            <div>
              <p className="error-form">{formikLogin.errors.password}</p>
            </div>
          )}
          <div className="input-container">
            <i
              className={
                isShowPassword
                  ? "zmdi zmdi-eye-off input-icon"
                  : "zmdi zmdi-eye input-icon"
              }
              onClick={showPassword}
            ></i>
            <input
              style={{ margin: "0 0 20px 0" }}
              onChange={formikLogin.handleChange}
              onBlur={formikLogin.handleBlur}
              className="input-login"
              value={formikLogin.values.password}
              name="password"
              placeholder="Password"
              type={isShowPassword ? "text" : "password"}
            />
          </div>

          <MainButton onClick={formikLogin.handleSubmit} text="SIGN IN" />
          <a href={FORGOT_PASSWORD_EMAIL} style={{ marginLeft: "12px" }}>
            Forgot password?
          </a>
          <br />
          <div style={{ marginTop: "20px" }}>
            <GoogleOAuthProvider clientId="465474380667-f9p9m14150q86ittj2rlhtnidgv4v8c2.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={googleLogIn}
                onError={() => {
                  setError("Something went wrong. Please try again later.");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
        <div className="form signupForm">
          <h1>Sign up</h1>
          <p className="error-form">{error}</p>
          {formikSignUp.touched.name && formikSignUp.errors.name && (
            <div>
              <p className="error-form">{formikSignUp.errors.name}</p>
            </div>
          )}
          <input
            style={{ margin: "0 0 20px 0" }}
            className="input-login"
            onChange={formikSignUp.handleChange}
            onBlur={formikSignUp.handleBlur}
            value={formikSignUp.values.name}
            name="name"
            placeholder="Name"
            type="text"
          />

          {formikSignUp.touched.email && formikSignUp.errors.email && (
            <div>
              <p className="error-form">{formikSignUp.errors.email}</p>
            </div>
          )}
          <input
            style={{ margin: "0 0 20px 0" }}
            className="input-login"
            onChange={formikSignUp.handleChange}
            onBlur={formikSignUp.handleBlur}
            value={formikSignUp.values.email}
            name="email"
            placeholder="Email"
            type="text"
          />

          {formikSignUp.touched.password && formikSignUp.errors.password && (
            <div>
              <p className="error-form">{formikSignUp.errors.password}</p>
            </div>
          )}
          <div className="input-container">
            <i
              className={
                isShowPassword
                  ? "zmdi zmdi-eye-off input-icon"
                  : "zmdi zmdi-eye input-icon"
              }
              onClick={showPassword}
            ></i>
            <input
              style={{ margin: "0 0 20px 0" }}
              onChange={formikSignUp.handleChange}
              onBlur={formikSignUp.handleBlur}
              className="input-login"
              value={formikSignUp.values.password}
              name="password"
              placeholder="Password"
              type={isShowPassword ? "text" : "password"}
            />
          </div>

          {!isSignUpButtonClicked && (
            <MainButton onClick={formikSignUp.handleSubmit} text="SIGN UP" />
          )}
          <div style={{ marginTop: "20px" }}>
            <GoogleOAuthProvider clientId="465474380667-f9p9m14150q86ittj2rlhtnidgv4v8c2.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={googleLogIn}
                onError={() => {
                  setError("Something went wrong. Please try again later.");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
