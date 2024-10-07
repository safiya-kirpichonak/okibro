import * as Yup from "yup";

export const validationEmail = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
