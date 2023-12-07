import React, {createContext} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Layout from '../Layout/index';
import OrgFilter from './OrgFilter';
import MainWrapper from './MainWrapper';
import Dashboard from '../Dashboard/index';
import Import from '../Import';
import ImportList from '../Import/list';
import ImportView from '../Import/view';
import LogIn from '../LogIn/index';
import Signup from '../Signup/index';
import SignupSuccess from '../Signup/SignupSuccess';
import VerifyEmail from '../Signup/VerifyEmail';
import DepositTransfer from "../Reports/DepositTransfer"
import Forgot from '../Forgot/index';
import CheckYourEmail from '../Forgot/CheckYourEmail';
import ForgotSuccess from '../Forgot/ForgotSuccess';
import Example from '../Example/tiny';
import ExamplePageOne from '../Example/index';
import ExamplePageTwo from '../ExampleTwo/index';
import ProgramIndex from '../Program/index';
import AddProgram from '../Program/add_program';
import ProgramView from '../Program/view';
import Pokemon from '../Program/components/pokemon';
// import Merchant from '../Program/View/components/Merchant';
import SubProgram from '../Program/View/Subprogram';
import ProgramReport from '../Program/View/Reports';
import ProgramUsers from '../Program/View/User';
import ProgramUser from '../Program/View/User/edit';
import ProgramViewUser from '../Program/View/User/view';

import UsersIndex from '../Users/index';
import AddUser from '../Users/add_user';
import ViewUser from '../Users/view_user';
import EditUser from '../Users/edit_user';
import UserImport from '../Users/import_user';

import RoleIndex from '../Role/index';
import RoleAdd from '../Role/add_role';
import RoleView from '../Role/view_role';
import RoleEdit from '../Role/edit_role';

import PermissionIndex from '../Permission/index';
import PermissionAdd from '../Permission/add_permission';
import PermissionView from '../Permission/view_permission';
import PermissionEdit from '../Permission/edit_permission';

// import EventsIndex from '../Events/index';
// import AddEvent from '../Events/add_event';
import EditEvent from '../Program/View/components/event/edit';

import MerchantsIndex from '../Merchant/index';
import AddMerchant from '../Merchant/add_merchant';
import ViewMerchant from '../Merchant/view_merchant';
import EditMerchant from '../Merchant/edit_merchant';

import DomainsIndex from '../Domain/index';
import AddDomain from '../Domain/add_domain';
import ViewDomain from '../Domain/view_domain';
import EditDomain from '../Domain/edit_domain';

import OrdersIndex from '../PhysicalOrders/index';
import EditOrder from '../PhysicalOrders/edit_order';
import TangoOrder from '../PhysicalOrders/tango_order';

import {
  AwardDetail,
  CashDeposit,
  Inventory,
  InventoryOrder,
  JournalDetailed,
  PointsPurchaseSummary,
  PointsReserve,
  ProgramStatus,
  SupplierRedemption,
  Deposit,
  ParticipantStatusSummary,
  ParticipantAccountSummary,
  ParticipantAccountSubProgram,
  UnassignedProgramDomains,
  MoniesPendingAmount,
  ExpirePoints,
  ExpireMonies
 } from '../Reports';

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
    <Route exact path="/program/:programId/event/:eventId/edit" component={EditEvent} />
    {/* <Route exact path="/program/:programId/merchants" component={Merchant} /> */}
    <Route exact path="/program/:programId/subprograms" component={SubProgram} />
    <Route exact path="/program/:programId/reports" component={ProgramReport} />
    <Route exact path="/program/:programId/users" component={ProgramUsers} />
    <Route exact path="/program/:programId/user/view/:userId" component={ProgramViewUser} />
    <Route exact path="/program/:programId/user/:userId" component={ProgramUser} />
    {/* <Route path="/program/dashboard" component={ProgramDashboard} /> */}
  </Switch>
);

const Merchants = () => (
  <Switch>
    <Route exact path="/merchants" component={MerchantsIndex} />
    <Route exact path="/merchants/add" component={AddMerchant} />
    <Route exact path="/merchants/view/:id" component={ViewMerchant} />
    <Route exact path="/merchants/edit/:id" component={EditMerchant} />
  </Switch>
);

const Users = () => (
  <Switch>
    <Route exact path="/users" component={UsersIndex} />
    <Route exact path="/users/add" component={AddUser} />
    <Route exact path="/users/view/:id" component={ViewUser} />
    <Route exact path="/users/edit/:id" component={EditUser} />
    <Route exact path="/users/import" component={UserImport} />
  </Switch>
);

const Roles = () => (
  <Switch>
    <Route exact path="/roles" component={RoleIndex} />
    <Route exact path="/roles/add" component={RoleAdd} />
    <Route exact path="/roles/view/:id" component={RoleView} />
    <Route exact path="/roles/edit/:id" component={RoleEdit} />
  </Switch>
);

const Permissions = () => (
  <Switch>
    <Route exact path="/permissions" component={PermissionIndex} />
    <Route exact path="/permissions/add" component={PermissionAdd} />
    <Route exact path="/permissions/view/:id" component={PermissionView} />
    <Route exact path="/permissions/edit/:id" component={PermissionEdit} />
  </Switch>
);

const Domains = () => (
  <Switch>
    <Route exact path="/domains" component={DomainsIndex} />
    <Route exact path="/domains/add" component={AddDomain} />
    <Route exact path="/domains/view/:id" component={ViewDomain} />
    <Route exact path="/domains/edit/:id" component={EditDomain} />
  </Switch>
);

const PhysicalOrders = () => (
  <Switch>
    <Route exact path="/physical-orders" component={OrdersIndex} />
    <Route exact path="/physical-orders/edit/:id" component={EditOrder} />
  </Switch>
);

const TangoOrders = () => (
  <Switch>
    <Route exact path="/tango-orders/details/:id" component={TangoOrder} />
  </Switch>
);

const Reports = () => (
  <Switch>
    <Route exact path="/reports/award-detail" component={AwardDetail} />
    <Route exact path="/reports/cash-deposit" component={CashDeposit} />
    <Route exact path="/reports/inventory" component={Inventory} />
    <Route exact path="/reports/inventory-order" component={InventoryOrder} />
    <Route exact path="/reports/journal-detailed" component={JournalDetailed} />
    <Route exact path="/reports/points-purchase-summary" component={PointsPurchaseSummary} />
    <Route exact path="/reports/points-reserve" component={PointsReserve} />
    <Route exact path="/reports/program-status" component={ProgramStatus} />
    <Route exact path="/reports/supplier-redemption" component={SupplierRedemption} />
    <Route exact path="/reports/deposit" component={Deposit} />
    <Route exact path="/reports/deposit-transfer" component={DepositTransfer} />
    <Route exact path="/reports/participant-status-summary" component={ParticipantStatusSummary} />
    <Route exact path="/reports/participant-account-summary" component={ParticipantAccountSummary} />
    <Route exact path="/reports/unassigned-program-domains" component={UnassignedProgramDomains} />
    <Route exact path="/reports/monies-pending-amount" component={MoniesPendingAmount} />
    <Route exact path="/reports/expire-points" component={ExpirePoints} />
    <Route exact path="/reports/expire-monies" component={ExpireMonies} />
  </Switch>
);


const Events = () => (
  <Switch>
    {/* <Route exact path="/events" component={EventsIndex} /> */}
  </Switch>
);

const Imports = () => (
  <Switch>
    <Route exact path="/import" component={Import} />
    <Route exact path="/import/list" component={ImportList} />
    <Route exact path="/import/view/:id" component={ImportView} />
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
        <OrgFilter />
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute path="/pages" component={Pages} />
        <PrivateRoute path="/program" component={Programs} />
        <PrivateRoute path="/merchants" component={Merchants} />
        <PrivateRoute path="/users" component={Users} />
        <PrivateRoute path="/roles" component={Roles} />
        <PrivateRoute path="/permissions" component={Permissions} />
        <PrivateRoute path="/events" component={Events} />
        <PrivateRoute path="/import" component={Imports} />
        <PrivateRoute path="/domains" component={Domains} />
        <PrivateRoute path="/physical-orders" component={PhysicalOrders} />
        <PrivateRoute path="/tango-orders" component={TangoOrders} />
        <PrivateRoute path="/" component={Reports} />
        <PrivateRoute path="/treeview" component={TreeView} />
        <PrivateRoute path="/pokemon" component={Pokemon} />
        <PrivateRoute path="/example" component={Example} />
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
