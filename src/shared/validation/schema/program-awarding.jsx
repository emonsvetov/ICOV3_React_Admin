import { Validators } from '@lemoncode/fonk';
import { isTrue } from '@lemoncode/fonk-is-true-validator';
Validators.required.setErrorMessage("This field is required");
isTrue.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        // country: [Validators.required.validator],
        // use_budget_cascading: [Validators.required.validator, isTrue.validator],
        // enable_budget_summary: [Validators.required.validator, isTrue.validator],
        // is_pay_in_advance: [Validators.required.validator],
    }
}
export default validationSchema;