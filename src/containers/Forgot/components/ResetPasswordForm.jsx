import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import LockOutlineIcon from 'mdi-react/LockOutlineIcon';

const ResetPasswordForm = () => {
  const validate = values => {
    let errors = {};
    if (!values.password) {
      errors.password = "Password is required";
    }
    if (!values.confirm_password) {
      errors.confirm_password = "Confirm Password is required";
    }
    if (values.password != values.confirm_password) {
      errors.confirm_password = "Confirm Password does not match";
    }
    return errors;
  }
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const onSubmit = async values => {
    await sleep(400);
    window.location = '/forgot/success'
  }
  return (
  <Form
    onSubmit={onSubmit}
    validate={validate}
    render={({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__form-group-field flex-column">
        <div className="account__head">
          <h3 className="account__title">Reset Your Password</h3>
        </div>
        <Field name="password">
          {({ input, meta }) => (
            <div className="form__form-group">
              <span className="form__form-group-label">New Password</span>
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <LockOutlineIcon />
                  </div>
                  <div className="form__form-group-row">
                    <input type="text" {...input} placeholder="Password" />
                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                  </div>
              </div>
            </div>
          )}
        </Field>
        <Field name="confirm_password">
          {({ input, meta }) => (
            <div className="form__form-group">
              <span className="form__form-group-label">Confirm Password</span>
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <LockOutlineIcon />
                  </div>
                  <div className="form__form-group-row">
                    <input type="text" {...input} placeholder="Password" />
                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                  </div>
              </div>
            </div>
          )}
        </Field>
      </div>
      {/* <Link className="btn btn-primary account__btn account__btn--small" to="/pages/one">Continue</Link> */}
      <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={submitting}>Reset Password</button>
      </form>
    )}
  />
)}

export default ResetPasswordForm;
