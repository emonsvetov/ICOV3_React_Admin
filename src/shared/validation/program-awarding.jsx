import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/program-awarding';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;