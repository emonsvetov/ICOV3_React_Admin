import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from 'mdi-react/FacebookIcon';
import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import SignupForm from './components/SignupForm';
const IncentcoLogo = `${process.env.PUBLIC_URL}/img/logo-sm.png`;

const axios = require('axios');

const Signup = () => {

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const onSubmit = async(values) => {
    // alert("submitted");
    // console.log(values);
    // const data = {
    //   first_name: values.first_name,
    //   last_name: values.last_name,
    //   email: values.email,
    //   password: values.password,
    //   password_confirmation: values.password_confirmation,
    // }
    // console.log(data)

    // try {
    //   const resp = await axios.post('/organization/1/register', values);
    //   console.log(resp)
    // } catch (error) {
    //   // Handle Error Here
    //   // alert('NOWHERE')
    //   console.log(error.response.data.errors);
    //   setErrors(error.response.data.errors)
    //   console.log(errors)
    // }

    setLoading(true)

    // const perform = await axios.post('/organization/1/register', values);
    axios.post('/organization/1/register', values)
    .then( (res) => {
      // console.log(res)
      // console.log(res.status == 200)
      if(res.status == 200)  {
        // localStorage.setItem("authToken", res.data.access_token);
        // localStorage.setItem("authUser", JSON.stringify(res.data.user));
        window.location = '/signup/success'
      }
    })
    .catch( error => {
      console.log(error.response.data.errors);
      setErrors(error.response.data.errors);
      setLoading(false)
    })
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
            <SignupForm onSubmit={onSubmit} errors={errors} loading={loading} />
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
