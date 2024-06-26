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
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"

const axios = require('axios');

const LogInForm = () => {

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [email, setEmail] = useState();
  const [value, setValue] = useState();
  const [step, setStep] = useState(1);
  const dispatch = useDispatch()

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
    if (!values.code && verificationRequired){
      errors.code = "Code is required";
    }
    return errors;
  }

  const onSubmit = async values => {
    setEmail(values.email)
    submit(values)
  };

  const generate2faSecret = async (values) => {
    try {
      setLoading(true)
        const response = await axios.post('/generate-2fa-secret', values);
        if (response.status == '200') {
          setErrors(null);
          setStep(2)
          setVerificationRequired(true);
        }
      } catch (error) {
          setErrors(error.response.data);
      }
      finally{
        setLoading(false)
      }
  };

  const sendAgain = () => {
    generate2faSecret(value)
    dispatch(sendFlashMessage('New code has been sent again', 'alert-success'))
  }

  const backToLogin = () => {
    setVerificationRequired(false);
    setStep(1)
    setErrors(null);
  }

  const submit = (values) => {
    if(step == 1 ){
      delete values.code;
    }
    axios.post('/login', values)
    .then( (res) => {
      if(res.status == 200)  {
        login(res.data)
        var t = setTimeout(window.location = '/', 500)
      }
    })
    .catch( error => {

      if (error.response.status === 403) {
        setValue(values);
        generate2faSecret(values);
      }

      else {
        setErrors(error.response.data);
        setLoading(false)
      }
      
    })
  }

  return (
    <>
        <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form className="form" onSubmit={handleSubmit}>
          {
            errors && <ApiErrorMessage className="alert alert-danger fade show w100" errors={errors} />
          }
          {
            verificationRequired ?
             <Field name="code">
             {({ input, meta }) => (
                 <div className="form__form-group">
                  <div className='mb-2'>
                    <h5>Code sent to email <span className='text-blue'>{email}</span></h5>
                  </div>
                   <div className="form__form-group-field">
                     <div className="form__form-group-row">
                       <input type="code" {...input} placeholder="Enter 2FA code" />
                       {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                     </div>
                 </div>
               </div>
             )}
             </Field> :
             <>
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
             </>
          }
       
          {/* <div className="form__form-group">
            <div className="form__form-group-field">
              <Field
                name="remember_me"
                component={renderCheckBoxField}
                label="Remember me"
              />
            </div>
          </div> */}
          <button type="submit" className="btn btn-primary account__btn account__btn--small" disabled={loading}>Log In</button>
          {/* <Link className="btn btn-primary account__btn account__btn--small" to="/pages/one">Sign In</Link> */}
          {!verificationRequired?
            <Link className="btn btn-outline-primary account__btn account__btn--small" to="/signup">Create Account</Link>:
          <>
            <div className='resend-btn'>
              <a onClick={()=>sendAgain()}>Resend Code</a>
            </div>
            <div className='resend-btn'>
              <a onClick={()=>backToLogin()}>Back</a>
            </div>
          </>
          }
        </form>
        )}
      />
    </>
)}

export default LogInForm;
