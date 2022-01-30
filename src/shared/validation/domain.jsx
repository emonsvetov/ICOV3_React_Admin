import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/domain';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;