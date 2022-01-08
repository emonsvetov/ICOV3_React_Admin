import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/program-info';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;