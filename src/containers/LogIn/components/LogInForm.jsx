import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import EyeIcon from 'mdi-react/EyeIcon';
// import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import LockOutlineIcon from 'mdi-react/LockOutlineIcon';
import EmailOutlineIcon from 'mdi-react/EmailOutlineIcon';
import renderCheckBoxField from '../../../shared/components/form/CheckBox';
import { ApiErrorMessage } from '@/shared/components/flash';
import {login} from '../../App/auth';

const axios = require('axios');

const LogInForm = () => {

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [google2faUrl, setGoogle2faUrl] = useState('');
  const [message, setMessage] = useState('');
  const onSubmit = async values => {

    console.log('onSubmit called', values);

    axios.post('/login', values)
    .then( (res) => {
      // console.log(res);
      // return;
      // console.log(res.status == 200)
      if(res.status == 200)  {
        const google2fa_url = res.data.google2fa_url;
        setGoogle2faUrl(google2fa_url);
        setErrors('Check your email for the 2FA code.');
        // var t = setTimeout(window.location = '/', 500)
      }
    })
    .catch( error => {
      // console.log(error.response.data.message);
      setErrors(error.response.data);
      setLoading(false)
    })
  };

  const handleVerify2FA = async value => {

    console.log('2FA called');
    const email = value.email;
    const response = await fetch('/api/verify-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
      
    } else {
      setMessage(data.error);
    }
  };

  return (
  <Form
    onSubmit={onSubmit}
    validate={validate}
    render={({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={google2faUrl ? handleVerify2FA : handleSubmit}>
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
      <Field name="password">
        {({ input, meta }) => (
          <div className="form__form-group">
            <span className="form__form-group-label">Password</span>
              <div className="form__form-group-field">
                <div className="form__form-group-icon">
                  <LockOutlineIcon />
                </div>
                <div className="form__form-group-row">
                  <input type="password" {...input} placeholder="Password" />
                  {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                </div>
            </div>
            <div className="account__forgot-password">
              <a href="/forgot">Forgot a password?</a>
            </div>
          </div>
        )}
      </Field>
      {google2faUrl ? (
         <Field name="password">
         {({ input, meta }) => (
           <div className="form__form-group">
             <span className="form__form-group-label">Password</span>
               <div className="form__form-group-field">
                 <div className="form__form-group-icon">
                   <LockOutlineIcon />
                 </div>
                 <div className="form__form-group-row">
                   <input type="password" {...input} placeholder="Password" />
                   {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                 </div>
             </div>
             <div className="account__forgot-password">
               <a href="/forgot">Forgot a password?</a>
             </div>
           </div>
         )}
       </Field>
      ) : (
        <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={loading}>Log In</button>
      )}
      {/* <div className="form__form-group">
        <div className="form__form-group-field">
          <Field
            name="remember_me"
            component={renderCheckBoxField}
            label="Remember me"
          />
        </div>
      </div> */}
    
      {/* <Link className="btn btn-primary account__btn account__btn--small" to="/pages/one">Sign In</Link> */}
      <Link className="btn btn-outline-primary account__btn account__btn--small" to="/signup">Create Account</Link>
      </form>
    )}
  />
)}

const validate = values => {
  let errors = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  return errors;
}

export default LogInForm;
