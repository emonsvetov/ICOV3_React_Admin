import { Validators } from '@lemoncode/fonk';
import { isTrue } from '@lemoncode/fonk-is-true-validator';
Validators.required.setErrorMessage("This field is required");
isTrue.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        // country: [Validators.required.validator],
        // use_budget_cascading: [Validators.required.validator, isTrue.validator],
        // allow_multiple_participants_per_unit: [Validators.required.validator, isTrue.validator],
        // transaction_fee: [Validators.required.validator],
    }
}
export default validationSchema;