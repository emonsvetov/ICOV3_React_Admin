import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/program-add';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;