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
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';

const axios = require('axios');

const LogInForm = () => {

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState();
  const [value, setValue] = useState();

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
        const response = await axios.post('/generate-2fa-secret', values);
        if (response.status == '200') {
          if (!modalOpen)
            setModalOpen(true);
        }
      } catch (error) {
          setErrors(error.response.data);
      }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const enterCode = () => {
    setVerificationRequired(true);
    setModalOpen(false)
  }

  const sendAgain = () => {
    generate2faSecret(value)
  }

  const submit = (values) => {

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
                    <h2>Enter 2FA code</h2>

                   <div className="form__form-group-field">
                     <div className="form__form-group-row">
                       <input type="code" {...input} placeholder="2FA Code" />
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
          <Link className="btn btn-outline-primary account__btn account__btn--small" to="/signup">Create Account</Link>
        </form>
        )}
      />
       <Modal style={{ maxWidth: '700px', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} isOpen={modalOpen} toggle={toggleModal}>
        <ModalBody  className='w100'>
          <Row className='w100'>
            <h4>We sent 2FA code to your address <span className='text-blue'>{email}</span> .</h4>
            <h4>Please enter the code or press "Send again" if you didnt't get it.</h4> 
          </Row>
          <div className='d-flex justify-content-between mt-4'>
            <button type="submit" className="btn btn-primary account__btn--small" disabled={loading} onClick={enterCode}>Enter code</button>
            <button type="submit" className="btn btn-outline-primary account__btn--small" onClick={sendAgain}>Send again</button>
          </div>
        </ModalBody>
      </Modal>
    </>
)}

export default LogInForm;
