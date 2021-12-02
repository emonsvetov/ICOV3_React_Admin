import React from 'react';
import { Link} from 'react-router-dom';
const IncentcoLogo = `${process.env.PUBLIC_URL}/img/logo-sm.png`;
const ResetPasswordForm = () => {
  return (
    <div className="account flex-column align-items-center pt-4">
      <img src={IncentcoLogo} className="img__logo_sm" alt="logo" />
      <div className="account__wrapper mt-0">
        <div className="account__card">
          <div className="form__form-group-field flex-column">
            <div className="account__head">
              <h3 className="account__title">Success</h3>
            </div>
            <p className="pb-4">You have successfully reset your password.</p>
            <Link className="btn btn-primary account__btn account__btn--small" to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
)}

export default ResetPasswordForm;
