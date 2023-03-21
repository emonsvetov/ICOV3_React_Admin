import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import validationSchema from './schema/addprogramuser';

const formValidation = (exclude_fields = []) => {
  if( exclude_fields.length > 0 )
  {
    exclude_fields.map( field => {
      delete validationSchema["field"][field]
    })
  }
  return createFinalFormValidation(validationSchema);
}

export default formValidation;