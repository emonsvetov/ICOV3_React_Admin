import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/program-users';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;