import { Validators } from '@lemoncode/fonk';
import { isTrue } from '@lemoncode/fonk-is-true-validator';
Validators.required.setErrorMessage("This field is required");
isTrue.setErrorMessage("This field is required");

const validationSchema = {
    field: {
        name: [Validators.required.validator],
        merchant_code: [Validators.required.validator],
        website: [Validators.required.validator],
        description: [Validators.required.validator],
        redemption_instruction: [Validators.required.validator],
        // toa_id: [Validators.required.validator],
        // is_default: [Validators.required.validator, isTrue.validator],
        logo: [Validators.required.validator],
        icon: [Validators.required.validator],
    }
}
export default validationSchema;