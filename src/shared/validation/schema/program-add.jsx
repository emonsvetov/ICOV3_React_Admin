import { Validators } from '@lemoncode/fonk';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        name: [Validators.required.validator],
        type: [Validators.required.validator],
        setup_fee: [Validators.required.validator],
        is_pay_in_advance: [Validators.required.validator],
        is_invoice_for_rewards: [Validators.required.validator],
        is_add_default_merchants: [Validators.required.validator],
    }
}
export default validationSchema;