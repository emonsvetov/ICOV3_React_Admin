import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/adduser';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;