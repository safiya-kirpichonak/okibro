import { useFormik } from "formik";
import React, { useState } from "react";

import { validationChangePassword } from "./formik";
import MainButton from "../../../components/main-button";
import UserService from "../../../../services/UserService";

const ChangePasswordSection = () => {
  const [result, setResult] = useState("");
  const [isShowPassword, setShowPassword] = useState(false);

  const formikChangePassword = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: validationChangePassword,
    onSubmit: async (values) => {
      await UserService.getUser();
      const { isError } = await UserService.changePassword(values);
      if (!isError) {
        setResult("Password was successfully changed!");
        formikChangePassword.resetForm();
      } else {
        formikChangePassword.resetForm();
        setResult("Incorrect credentials!");
      }
    },
  });

  const onClickShowPassword = async () => {
    setShowPassword(!isShowPassword);
  };

  return (
    <div className="single-schedule-area single-page d-flex flex-wrap">
      <p className="error-form">{result}</p>

      {formikChangePassword.touched.oldPassword &&
        formikChangePassword.errors.oldPassword && (
          <div>
            <p className="error-form">
              {formikChangePassword.errors.oldPassword}
            </p>
          </div>
        )}

      <input
        type={isShowPassword ? "text" : "password"}
        className="form-control"
        name="oldPassword"
        placeholder="Old password"
        onChange={formikChangePassword.handleChange}
        onBlur={formikChangePassword.handleBlur}
        value={formikChangePassword.values.oldPassword}
        style={{ margin: "12px 0 12px 0" }}
      />

      {formikChangePassword.touched.newPassword &&
        formikChangePassword.errors.newPassword && (
          <div>
            <p className="error-form">
              {formikChangePassword.errors.newPassword}
            </p>
          </div>
        )}

      <input
        type={isShowPassword ? "text" : "password"}
        className="form-control"
        name="newPassword"
        id="password"
        placeholder="New password"
        onChange={formikChangePassword.handleChange}
        onBlur={formikChangePassword.handleBlur}
        value={formikChangePassword.values.newPassword}
        style={{ margin: "12px 0 12px 0" }}
      />

      <MainButton text="Show password" onClick={onClickShowPassword} />
      <div style={{ marginLeft: "20px" }}>
        <MainButton text="Change" onClick={formikChangePassword.handleSubmit} />
      </div>
    </div>
  );
};

export default ChangePasswordSection;
