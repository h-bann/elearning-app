import Joi from "joi";
import { formatValidation } from "./utils";

export const contactFormSchema = Joi.object({
  name: Joi.string().alphanum().min(6).max(40).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  message: Joi.string().alphanum().required(),
});

export const signupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  username: Joi.string().alphanum().min(5).max(15).required(),
  password: Joi.string().min(5).required(),
  passwordConfirmation: Joi.string().min(5).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(15).required(),
  password: Joi.string().min(5).required(),
});

export const userDetailsResetSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  username: Joi.string().alphanum().min(5).max(15),
  currentPassword: Joi.string(),
  password: Joi.string().min(5),
  passwordConfirmation: Joi.string(),
});

export const formValidation = (state, schema, setErrors) => {
  const { error } = schema.validate(state, {
    abortEarly: false,
  });
  console.log(error);
  let errors = {};
  if (error) {
    error.details.forEach((error) => {
      const formattedError = formatValidation(error.message);
      errors[error.context.key] = formattedError;
      setErrors(errors);
    });
    console.log(errors);
    console.log(error);
  } else if (!error) {
    setErrors("");
  }
};
