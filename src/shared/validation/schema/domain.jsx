import { Validators } from '@lemoncode/fonk';
import { isTrue } from '@lemoncode/fonk-is-true-validator';
Validators.required.setErrorMessage("This field is required");
isTrue.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        name: [Validators.required.validator],
        address: [Validators.required.validator],
    }
}
export default validationSchema;