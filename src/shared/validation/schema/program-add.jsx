import { Validators } from '@lemoncode/fonk';
import { isNumber } from '@lemoncode/fonk-is-number-validator';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        name: [Validators.required.validator],
        type: [Validators.required.validator],
        setup_fee: [isNumber.validator]
    }
}
export default validationSchema;