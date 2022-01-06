import { Validators } from '@lemoncode/fonk';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        event_name: [Validators.required.validator],
        amount: [Validators.required.validator],
        ledger_code: [Validators.required.validator],        
        email_template: [Validators.required.validator],
        min_amount: [Validators.required.validator],
        max_amount: [Validators.required.validator],
        event_message: [Validators.required.validator]
        
    }
}
export default validationSchema;