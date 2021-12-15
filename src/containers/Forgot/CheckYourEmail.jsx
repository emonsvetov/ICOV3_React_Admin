import React from 'react';
import { Link } from 'react-router-dom';
const IncentcoLogo = `${process.env.PUBLIC_URL}/img/logo-sm.png`;

const CheckYourEmail = () => (
<div>
    <div className="account flex-column align-items-center pt-4">
      <img src={IncentcoLogo} className="img__logo_sm" alt="logo" />
      <div className="account__wrapper mt-0">
      <div className="account__card">
        <div className="account__head">
          <h3 className="account__title">Check Your Email
          </h3>
        </div>
        <p className="py-2">We just sent you an email.<br />
        Please follow the instructions in the email to reset your password.</p>
        {/* <Link className="btn btn-outline-primary account__btn account__btn--small mt-4" to="/forgot?confirm=yourcodehere">Simulate Reset Password Click</Link> */}
      </div>
    </div>
  </div>
</div>
);

export default CheckYourEmail;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
