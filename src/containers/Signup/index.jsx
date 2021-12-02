import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from 'mdi-react/FacebookIcon';
import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import SignupForm from './components/SignupForm';
const IncentcoLogo = `${process.env.PUBLIC_URL}/img/logo-sm.png`;

const Signup = () => {

  const onSubmit = (values) => {
    alert("submitted");
    console.log(values);
  }

  return (
    <div>
      <div className="account flex-column align-items-center pt-4">
        <img src={IncentcoLogo} className="img__logo_sm" alt="logo" />
        <div className="account__wrapper mt-0">
          <div className="account__card">
            <div className="account__head">
              <h3 className="account__title">Welcome
                {/* <span className="account__logo"> Easy
                  <span className="account__logo-accent">DEV</span>
                </span> */}
              </h3>
              <h4 className="account__subhead subhead">Create an account to continue</h4>
            </div>
            <SignupForm onSubmit={onSubmit} />
            <div className="account__or">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
