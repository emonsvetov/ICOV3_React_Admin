import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import LogIn from '../LogIn/index';
import Signup from '../Signup/index';
import Forgot from '../Forgot/index';
import CheckYourEmail from '../Forgot/CheckYourEmail';
import ForgotSuccess from '../Forgot/ForgotSuccess';
import ExamplePageOne from '../Example/index';
import ExamplePageTwo from '../ExampleTwo/index';

const Pages = () => (
  <Switch>
    <Route path="/pages/one" component={ExamplePageOne} />
    <Route path="/pages/two" component={ExamplePageTwo} />
  </Switch>
);

const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route path="/pages" component={Pages} />
    </div>
  </div>
);

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/" component={LogIn} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/forgot" component={Forgot} />
        <Route exact path="/forgot/checkemail" component={CheckYourEmail} />
        <Route exact path="/forgot/success" component={ForgotSuccess} />
        <Route path="/" component={wrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
