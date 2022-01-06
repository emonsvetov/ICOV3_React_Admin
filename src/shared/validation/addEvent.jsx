import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/addEvent';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;