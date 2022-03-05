import { Validators } from '@lemoncode/fonk';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        first_name: [Validators.required.validator],
        last_name: [Validators.required.validator],
        roles: [Validators.required.validator],
        email: [Validators.required.validator],
        phone: [Validators.required.validator],
        // password: [Validators.required.validator],
        // password_confirmation: [Validators.required.validator],
        // award_level: [Validators.required.validator],
        // employee_number: [Validators.required.validator],
        // work_anniversary: [Validators.required.validator],
        // supervisor_employee_number: [Validators.required.validator],
        // division: [Validators.required.validator],
        // dob: [Validators.required.validator],
    }
}
export default validationSchema;