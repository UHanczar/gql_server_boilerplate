import * as yup from 'yup';
import { notLongEmail, notValidEmail, notValidPassword} from "../modules/register/registerErrorMessages";

export const checkRegisterSchemaParams = yup
  .object()
  .shape({
    email: yup.string().min(3, notLongEmail).max(255).email(),
    password: yup.string().min(6, notValidPassword).max(255),
  });
