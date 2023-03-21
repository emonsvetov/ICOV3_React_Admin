import { Validators } from '@lemoncode/fonk';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        name: [Validators.required.validator],
        // state_id: [Validators.required.validator],
    }
}
export default validationSchema;