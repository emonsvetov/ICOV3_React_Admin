import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import EmailOutlineIcon from 'mdi-react/EmailOutlineIcon';
import { Spinner } from 'reactstrap';
import {ApiErrorMessage} from '@/shared/components/flash'

const ForgotForm = ( {onSubmit, loading, errors} ) => {

  // useEffect(() => {
  // });

  const validate = values => {
    let errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  }
  
  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  // const onSubmit = async values => {
  //   await sleep(400);
  //   window.location = '/forgot/checkemail'
  // }

  return (
  <Form
    onSubmit={onSubmit}
    validate={validate}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
      <div className="account__head">
        <h3 className="account__title">Forgot Password?</h3>
      </div>
      <p className="py-4">Please enter the email address you use to sign in with INCENTCO</p>

      {
        errors && <ApiErrorMessage className="alert alert-danger fade show w100" errors={errors} />
      }

      <Field name="email">
        {({ input, meta }) => (
          <div className="form__form-group">
            <span className="form__form-group-label">Email</span>
              <div className="form__form-group-field">
                <div className="form__form-group-icon">
                  <EmailOutlineIcon />
                </div>
                <div className="form__form-group-row">
                  <input type="text" {...input} placeholder="Email" />
                  {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                </div>
            </div>
          </div>
        )}
      </Field>
      {/* <Link className="btn btn-primary account__btn account__btn--small" to="/pages/one">Continue</Link> */}
      <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={loading}>Continue</button>

      {loading && <div className='mb-3 text-center w100'><Spinner animation="border" size="sm" variant="warning" /></div>}

      <Link className="btn btn-outline-primary account__btn account__btn--small" to="/login">Back to Sign in</Link>
      </form>
    )}
  </Form>
)}

export default ForgotForm;
