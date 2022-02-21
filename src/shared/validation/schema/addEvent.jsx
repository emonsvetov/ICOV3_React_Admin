import { Validators } from '@lemoncode/fonk';
import { isNumber } from '@lemoncode/fonk-is-number-validator';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        name: [Validators.required.validator],
        // icon: [Validators.required.validator],
        // type_id: [Validators.required.validator],
        amount: [Validators.required.validator, isNumber.validator],
        email_template_id: [Validators.required.validator],
        message: [Validators.required.validator]
        
    }
}
export default validationSchema;