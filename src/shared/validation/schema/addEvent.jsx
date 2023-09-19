import { Validators } from '@lemoncode/fonk';
import { isNumber } from '@lemoncode/fonk-is-number-validator';
import {isObject, isBadgeAward} from "../../helpers";
Validators.required.setErrorMessage("This field is required");

export const maxAwardableAmountRequiredValidator = args => {
  const { value, values } = args;
  // console.log(values?.event_type_id)
  if( isBadgeAward(values?.event_type_id) ) {
      return {
          succeeded: true,
          type: 'max_awardable_amount_required',
          message: ''
      }
  } else  {
      return Validators.required.validator(args);
  }
}

export const maxAwardableAmountNumberValidator = args => {
  console.log(values?.event_type_id)
  const { value, values } = args;
  if( isBadgeAward(values?.event_type_id) ) {
      return {
          succeeded: true,
          type: 'max_awardable_amount_number',
          message: ''
      }
  }else{
      return isNumber.validator(args);
  }
}

const validationSchema = {
    field: {
        name: [Validators.required.validator],
        // icon: [Validators.required.validator],
        event_icon_id: [Validators.required.validator, isNumber.validator],
        // max_awardable_amount: [ maxAwardableAmountRequiredValidator, maxAwardableAmountNumberValidator],
        // awarding_points: [isNumber.validator],
        event_type_id: [Validators.required.validator],
        message: [Validators.required.validator]
    }
}
export default validationSchema;
