import React, {createContext} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import Dashboard from '../Dashboard/index';
import LogIn from '../LogIn/index';
import Signup from '../Signup/index';
import SignupSuccess from '../Signup/SignupSuccess';
import VerifyEmail from '../Signup/VerifyEmail';

import Forgot from '../Forgot/index';
import CheckYourEmail from '../Forgot/CheckYourEmail';
import ForgotSuccess from '../Forgot/ForgotSuccess';
import ExamplePageOne from '../Example/index';
import ExamplePageTwo from '../ExampleTwo/index';
import ProgramIndex from '../Program/index';
import AddProgram from '../Program/add_program';
import ProgramView from '../Program/view';
import Pokemon from '../Program/components/pokemon';

import UsersIndex from '../Users/index';
import AddUser from '../Users/add_user';
import ViewUser from '../Users/view_user';
import EditUser from '../Users/edit_user';

// import EventsIndex from '../Events/index';
import AddEvent from '../Events/add_event';
import ViewEvent from '../Program/ProgramView/components/event/EventDetail';

import MerchantsIndex from '../Merchants/index';
import AddMerchant from '../Merchants/add_merchant';

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
    <Route exact path="/program/view/:id" component={ProgramView} />
    <Route exact path="/program/view/:programId/:eventId" component={ViewEvent} />
    {/* <Route path="/program/dashboard" component={ProgramDashboard} /> */}
  </Switch>
);

const Merchants = () => (
  <Switch>
    <Route exact path="/merchants" component={MerchantsIndex} />
    <Route exact path="/merchants/add" component={AddMerchant} />
  </Switch>
);

const Users = () => (
  <Switch>
    <Route exact path="/users" component={UsersIndex} />
    <Route exact path="/users/add" component={AddUser} />
    <Route exact path="/users/view/:id" component={ViewUser} />
    <Route exact path="/users/edit/:id" component={EditUser} />
  </Switch>
);


const Events = () => (
  <Switch>
    {/* <Route exact path="/events" component={EventsIndex} /> */}
    <Route exact path="/events/add/:id" component={AddEvent} />
    <Route exact path="/events/view/:id" component={ViewEvent} />
  </Switch>
);

const CustomPrivateRoute = (props) => {
  return (
    <div>
      <Layout />
      <div className="container__wrap">
        <PrivateRoute to="/" {...props} />
      </div>
    </div>
  )
}

const privateRoutes = () => {
  return (
    <div>
      <Layout />
      <div className="container__wrap">
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute path="/pages" component={Pages} />
        <PrivateRoute path="/program" component={Programs} />
        <PrivateRoute path="/merchants" component={Merchants} />
        <PrivateRoute path="/users" component={Users} />
        <PrivateRoute path="/events" component={Events} />
        <PrivateRoute path="/treeview" component={TreeView} />
        <PrivateRoute path="/pokemon" component={Pokemon} />
      </div>
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
        <CustomPrivateRoute path="/email/verify/:userid?/:vcode?" component={VerifyEmail} />
        <PrivateRoute path="/" component={privateRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Routes;
