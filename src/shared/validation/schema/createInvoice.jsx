import { Validators } from '@lemoncode/fonk';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        program: [Validators.required.validator],
        amount:[Validators.required.validator],
        amount_confirm: [Validators.required.validator]
        
    }
}
export default validationSchema;