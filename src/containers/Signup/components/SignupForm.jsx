import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
// import { connect } from 'react-redux';
import AccountCircleOutlineIcon from 'mdi-react/AccountCircleOutlineIcon';
import LockOutlineIcon from 'mdi-react/LockOutlineIcon';
import EmailOutlineIcon from 'mdi-react/EmailOutlineIcon';
import HomeOutlineIcon from 'mdi-react/HomeOutlineIcon';

const required = value => value ? undefined : 'Required';

// const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
//   <div>
//     <label>{label}</label>
//     <div>
//       <input {...input} placeholder={label} type={type}/>
//       {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
//     </div>
//   </div>
// )

const SignupForm = ({onSubmit, errors, loading}) => {
  // console.log(typeof errors)
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
            {
            Object.keys(errors).map(function(k){
                return <li key={k}>{errors[k]}</li>
            })
            }
            </ul>
          </div>
        </div>}
        <Field name="organization_name">
        {({ input, meta }) => (
          <div className="form__form-group">
            <span className="form__form-group-label">Organization</span>
              <div className="form__form-group-field">
                <div className="form__form-group-icon">
                  <HomeOutlineIcon />
                </div>
                <div className="form__form-group-row">
                  <input type="text" {...input} placeholder="Organization name" />
                  {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                </div>
            </div>
          </div>
        )}
      </Field>
        <Field name="first_name">
          {({ input, meta }) => (
            <div className="form__form-group">
              <span className="form__form-group-label">First Name</span>
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <AccountCircleOutlineIcon />
                  </div>
                  <div className="form__form-group-row">
                    <input type="text" {...input} placeholder="First Name" />
                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                  </div>
              </div>
            </div>
          )}
        </Field>

        <Field name="last_name">
          {({ input, meta }) => (
            <div className="form__form-group">
              <span className="form__form-group-label">Last Name</span>
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <AccountCircleOutlineIcon />
                  </div>
                  <div className="form__form-group-row">
                    <input type="text" {...input} placeholder="Last Name" />
                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                  </div>
              </div>
            </div>
          )}
        </Field>

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
              <span className="form__form-group-label">Password</span>
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
                    <input type="text" {...input} placeholder="Confirm Password" />
                    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                  </div>
              </div>
            </div>
          )}
        </Field>

        <button type="submit" className="btn btn-outline-primary account__btn account__btn--small" disabled={loading}>Submit</button>
        {/* <Link onSubmit={} className="btn btn-outline-primary account__btn account__btn--small" to="/signup">Create Account</Link> */}

        <div className="text-center w100"><span className="form__form-group-label">Already have an account ?</span> <Link to="/login">Log In</Link></div>
      </form>
      )}
    />
  )
}

const validate = values => {
  let errors = {};
  if (!values.organization_name) {
    errors.organization_name = "Organization name is required";
  }
  if (!values.first_name) {
    errors.first_name = "First Name is required";
  }
  if (!values.last_name) {
    errors.last_name = "Last Name is required";
  }
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  if (!values.password_confirmation) {
    errors.password_confirmation = "Confirm Password is required";
  }
  if (values.password !== values.password_confirmation) {
    errors.password_confirmation = "Confirm Password did not match";
  }
  return errors;
};

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// const onSubmit = async values => {
//   // window.alert("Before");
//   await sleep(400);
//   window.alert(JSON.stringify(values, 0, 2));
// };

export default SignupForm;

// SignupForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
// };

// const SignupFormWithErrors = reduxForm({
//   form: 'sign_up_form',
// })(SignupForm);

// export default connect(state => ({
//   values: getFormValues('sign_up_form')(state),
//   submitErrors: getFormSubmitErrors('sign_up_form')(state),
// }))(SignupFormWithErrors)
