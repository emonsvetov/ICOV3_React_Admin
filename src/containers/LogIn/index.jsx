import React from "react";
import LogInForm from "./components/LogInForm";
const IncentcoLogo = `${process.env.PUBLIC_URL}/img/logo-sm.png`;

const LogIn = () => (
  <div>
    <div className="account flex-column align-items-center pt-4">
      <img src={IncentcoLogo} className="img__logo_sm" alt="logo" />
      <div className="account__wrapper mt-0">
        <div className="account__card">
          <div className="account__head">
            <h3 className="account__title">
              Welcome
              {/* <span className="account__logo"> Easy
                <span className="account__logo-accent">DEV</span>
              </span> */}
            </h3>
            <h4 className="account__subhead subhead">Log in to continue</h4>
          </div>
          <LogInForm onSubmit />
          {/* <div className="account__or">
            <p>Or Easily Using</p>
          </div>
          <div className="account__social">
            <Link
              className="account__social-btn account__social-btn--facebook"
              to="/pages/one"
            ><FacebookIcon />
            </Link>
            <Link
              className="account__social-btn account__social-btn--google"
              to="/pages/one"
            ><GooglePlusIcon />
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  </div>
);

export default LogIn;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
