import React from 'react';
import { Link} from 'react-router-dom';
const IncentcoLogo = `${process.env.PUBLIC_URL}/img/logo-sm.png`;
const SignupSuccess = () => {
  return (
    <div className="account flex-column align-items-center pt-4">
      <img src={IncentcoLogo} className="img__logo_sm" alt="logo" />
      <div className="account__wrapper mt-0">
        <div className="account__card">
          <div className="form__form-group-field flex-column">
            <div className="account__head">
              <h3 className="account__title">Thank you!</h3>
              <h4 className="account__subhead subhead">Account created successfully</h4>
            </div>
            <p className="pb-4">Your account is successfully created. Sign in to continue.</p>
            <Link className="btn btn-primary account__btn account__btn--small" to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
)}

export default SignupSuccess;
