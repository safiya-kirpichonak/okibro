import * as Yup from "yup";

export const validationLogIn = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

