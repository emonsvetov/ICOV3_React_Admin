import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/programInfo';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;