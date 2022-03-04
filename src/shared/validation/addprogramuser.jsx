import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/addprogramuser';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;