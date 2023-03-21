import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/addMerchant';
const formValidation = createFinalFormValidation(validationSchema);
export default formValidation;