import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/example';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;