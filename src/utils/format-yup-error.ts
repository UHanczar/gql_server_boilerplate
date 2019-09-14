import { ValidationError } from "yup";

export const formatYupError = (error: ValidationError): Array<{ path: string, message: string }> => {
  const errors: Array<{ path: string, message: string }> = [];

  error.inner.forEach(error => errors.push({
    path: error.path,
    message: error.message
  }));

  return errors;
};
