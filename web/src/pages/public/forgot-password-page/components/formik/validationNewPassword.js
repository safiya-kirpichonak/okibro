import * as Yup from "yup";

export const validationNewPassword = Yup.object().shape({
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .min(8, "New password must be at least 8 characters long")
    .required("New password is required"),
});
