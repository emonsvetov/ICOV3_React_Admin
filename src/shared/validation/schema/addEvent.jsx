import { Validators } from '@lemoncode/fonk';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        name: [Validators.required.validator],
        // icon: [Validators.required.validator],
        amount: [Validators.required.validator],
        email_template_id: [Validators.required.validator],     
        message: [Validators.required.validator]
        
    }
}
export default validationSchema;