import { Validators } from '@lemoncode/fonk';
import { isNumber } from '@lemoncode/fonk-is-number-validator';
Validators.required.setErrorMessage("This field is required");
const validationSchema = {
    field: {
        name: [Validators.required.validator],
        // icon: [Validators.required.validator],
        event_icon_id: [Validators.required.validator, isNumber.validator],
        max_awardable_amount: [Validators.required.validator, isNumber.validator],
        awarding_points: [isNumber.validator],
        event_type_id: [Validators.required.validator],
        message: [Validators.required.validator]
    }
}
export default validationSchema;