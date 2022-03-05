import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/editprogramuser';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;