/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import React, { useState } from "react";

import { validationEmail } from "./formik";
import MainButton from "../../../components/main-button";
import AuthService from "../../../../services/AuthService";

const SendEmailSection = () => {
  const [isEmailSending, setIsEmailSending] = useState(false);

  const formikSendEmail = useFormik({
    initialValues: { email: "" },
    validationSchema: validationEmail,
    onSubmit: async ({ email }) => {
      setIsEmailSending(true);
      formikSendEmail.resetForm();
      AuthService.forgotPasswordSendEmail(email);
    },
  });

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      {isEmailSending ? (
        <div style={{ margin: "80px 0 80px 0" }}>
          <h1 style={{ textAlign: "center" }}>
            An email was sent to you. Please, click the link to change the
            password.
          </h1>
        </div>
      ) : (
        <div>
          <h1>Forgot password</h1>
          <div className="single-schedule-area single-page d-flex flex-wrap">
            {formikSendEmail.touched.email && formikSendEmail.errors.email && (
              <div>
                <p className="error-form">{formikSendEmail.errors.email}</p>
              </div>
            )}

            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Write your gmail"
              onChange={formikSendEmail.handleChange}
              onBlur={formikSendEmail.handleBlur}
              value={formikSendEmail.values.email}
              style={{ margin: "12px 0 12px 0" }}
            />

            <div>
              <MainButton text="Send" onClick={formikSendEmail.handleSubmit} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmailSection;
