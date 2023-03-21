import { Validators } from '@lemoncode/fonk';
import { isTrue } from '@lemoncode/fonk-is-true-validator';
Validators.required.setErrorMessage("This field is required");
isTrue.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        first_name: [Validators.required.validator],
        last_name: [Validators.required.validator, isTrue.validator],
        email: [Validators.required.validator, isTrue.validator],
        role: [Validators.required.validator],
    }
}
export default validationSchema;