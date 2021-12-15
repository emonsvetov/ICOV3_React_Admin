import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import LockOutlineIcon from 'mdi-react/LockOutlineIcon';
import EmailOutlineIcon from 'mdi-react/EmailOutlineIcon';

const ResetPasswordForm = ({onSubmit, errors, loading }) => {
  const validate = values => {
    let errors = {};
    if (!values.password) {
      errors.password = "Password is required";
    }
    if (!values.password_confirmation) {
      errors.password_confirmation = "Confirm Password is required";
    }
    if (values.password != values.password_confirmation) {
      errors.password_confirmation = "Confirm Password does not match";
    }
    return errors;
  }
  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  // const onSubmit = async values => {
  //   await sleep(400);
  //   window.location = '/forgot/success'
  // }
  return (
  <Form
    onSubmit={onSubmit}
    validate={validate}
    render={({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
      {errors && 
        <div className="alert alert-danger fade show w100" role="alert">
          <div className="alert__content">
            <ul>
              <li>{errors}</li>
            </ul>
          </div>
        </div>
      }
      <div className="form__form-group-field flex-column">
        <div className="account__head">
          <h3 className="account__title">Reset Your Password</h3>
        </div>
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
        <Field name="password_confirmation">
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
      <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={loading}>Reset Password</button>
      </form>
    )}
  />
)}

export default ResetPasswordForm;
