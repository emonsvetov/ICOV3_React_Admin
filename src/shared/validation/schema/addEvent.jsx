import { Validators } from '@lemoncode/fonk';
import { isNumber } from '@lemoncode/fonk-is-number-validator';
Validators.required.setErrorMessage("This field is required");

export const awardAmountValidator = ({ values }) => {
  const succeeded = false;

  return {
    type: "AWARD_AMOUNT_VALIDATE",
    succeeded,
    message: succeeded
      ? ""
      : "Invalid Award Amount"
  };
};

const validationSchema = {
    field: {
        name: [Validators.required.validator],
        // icon: [Validators.required.validator],
        event_icon_id: [Validators.required.validator, isNumber.validator],
        max_awardable_amount: {
          awardAmountValidator: [awardAmountValidator]
        },
        awarding_points: [isNumber.validator],
        event_type_id: [Validators.required.validator],
        message: [Validators.required.validator]
    }
}
export default validationSchema;