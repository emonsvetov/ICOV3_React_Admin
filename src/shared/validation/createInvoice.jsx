import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/createInvoice';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;