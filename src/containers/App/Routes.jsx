import React, {createContext} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import LogIn from '../LogIn/index';
import Signup from '../Signup/index';
import SignupSuccess from '../Signup/SignupSuccess';

import Forgot from '../Forgot/index';
import CheckYourEmail from '../Forgot/CheckYourEmail';
import ForgotSuccess from '../Forgot/ForgotSuccess';
import ExamplePageOne from '../Example/index';
import ExamplePageTwo from '../ExampleTwo/index';
import ProgramIndex from '../Program/index';
import AddProgram from '../Program/add_program';
import ResidentGifts from '../Program/resident_gifts';

import TreeView from '../TreeViewBasic';

const Pages = () => (
  <Switch>
    <Route exact path="/pages" component={PagesDashboard} />
    <Route path="/pages/one" component={ExamplePageOne} />
    <Route path="/pages/two" component={ExamplePageTwo} />
  </Switch>
);

const Programs = () => (
  <Switch>
    <Route exact path="/program" component={ProgramIndex} />
    <Route exact path="/program/add" component={AddProgram} />
    <Route exact path="/program/resident-gifts" component={ResidentGifts} />
    {/* <Route path="/program/dashboard" component={ProgramDashboard} /> */}
  </Switch>
);

const privateRoutes = () => {
  return (
    <div>
      <Layout />
      <div className="container__wrap">
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute path="/pages" component={Pages} />
        <PrivateRoute path="/program" component={Programs} />
        <PrivateRoute path="/treeview" component={TreeView} />
      </div>
    </div>
  )
}

const Dashboard = () => {
  return (
    <div>
      Hello Dashboard!
    </div>
  )
}

const PagesDashboard = () => {
  return (
    <div>
      Pages Dashboard!
    </div>
  )
}

const Routes = () => (
  <MainWrapper>
    <main>
      <Switch>
        {/* <Route exact path="/" component={LogIn} /> */}
        {/* <PublicRoute restricted={true} component={LogIn} path="/login" exact /> */}
        <PublicRoute exact path="/login" component={LogIn} restricted={true} />
        <PublicRoute exact path="/signup" component={Signup} restricted={true} />
        <PublicRoute exact path="/signup/success" component={SignupSuccess} restricted={true} />
        <PublicRoute exact path="/forgot" component={Forgot} restricted={true} />
        <PublicRoute exact path="/forgot/checkemail" component={CheckYourEmail} restricted={true} />
        <PublicRoute exact path="/reset-password" component={Forgot} restricted={true} />
        <PublicRoute exact path="/forgot/success" component={ForgotSuccess} restricted={true} />
        <PrivateRoute path="/" component={privateRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Routes;
