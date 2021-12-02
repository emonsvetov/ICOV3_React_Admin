import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from 'mdi-react/FacebookIcon';
import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import ForgotForm from './components/ForgotForm';
import ResetPasswordForm from './components/ResetPasswordForm';
const IncentcoLogo = `${process.env.PUBLIC_URL}/img/logo-sm.png`;

const Forgot = () => {
  useEffect(() => {
    // Update the document title using the browser API
    checkForConfirmCode();
    // document.title = `You are on step ${step} with ${confirmCode}`;
  });
  const [step, setStep] = useState(0);
  const [confirmCode, setConfirmCode] = useState(null);
  const [validCode, setValidCode] = useState(false);
  // const [completed, setCompleted] = useState(false);

  let myPromise = new Promise(function(myResolve, myReject) {
    myResolve(true); // when successful
    myReject(false);  // when error
  });

  const checkForConfirmCode = () => {
    const params = new URLSearchParams(window.location.search) // id=123
    let confirm = params.get('confirm');
    if( confirm ) {
      setConfirmCode(confirm);
      myPromise.then( result => {
        if( result )  {
          setValidCode(true);
          setStep(1);
        }
      })
    }
  }
  return (
  <div>
    <div className="account flex-column align-items-center pt-4">
      <img src={IncentcoLogo} className="img__logo_sm" alt="logo" />
      <div className="account__wrapper mt-0">
        <div className="account__card">
          {step==0 && <ForgotForm onSubmit />}
          {step==1 && validCode && <ResetPasswordForm onSubmit />}
          {step==1 && confirmCode && !validCode && <div className="form__form-group-field flex-column"><p>Invalid or expired link</p></div>}
        </div>
      </div>
    </div>
  </div>
)}

export default Forgot;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
