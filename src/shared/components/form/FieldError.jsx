import { Field } from 'react-final-form';
const FieldError = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span className="form__form-group-error">{error}</span> : null
    }
  />
);
export default FieldError