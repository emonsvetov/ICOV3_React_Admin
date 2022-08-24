import React from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import {logout} from '../../App/auth';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const SidebarContent = ({ onClick, changeToDark, changeToLight, auth }) => {
  const handleHideSidebar = () => {
    onClick();
  }

  if( !auth ) return 'Loading...'

  return (
    <div className="sidebar__content">
      <ul className="sidebar__block">
        <SidebarLink title="Log Out" icon="exit" route="" onClick={logout} />
      </ul>
      <ul className="sidebar__block">
        <SidebarCategory title="Program" icon="diamond">
          <SidebarLink title="All Programs" route="/program" />
          <SidebarLink title="Create Program" route="/program/add" />
        </SidebarCategory>
        {auth.isSuperAdmin && <SidebarLink title="Merchants"  icon="store" route="/merchants" />}
        <SidebarLink title="Import"  icon="download" route="/import" />
        <SidebarCategory title="Reports" icon="book">
          <SidebarLink title="Inventory" route="/reports/inventory" />
          <SidebarLink title="Inventory Order" route="/reports/inventory-order" />
          <SidebarLink title="Journal Detailed" route="/reports/journal-detailed" />
          <SidebarLink title="Points Purchase Summary" route="/reports/points-purchase-summary" />
          <SidebarLink title="Points Reserve" route="/reports/points-reserve" />
          <SidebarLink title="Program Status" route="/reports/program-status" />
          <SidebarLink title="Supplier Redemption" route="/reports/supplier-redemption" />
          <SidebarLink title="Trial Balance" route="/reports/trial-balance" />
          <SidebarLink title="Deposit" route="/reports/deposit" />
          <SidebarLink title="Unassigned Program Domains" route="/reports/unassigned-program-domains" />
          <SidebarLink title="Monies Pending Amount" route="/reports/monies-pending-amount" />
        </SidebarCategory>
        {auth.isSuperAdmin && <SidebarLink title="Roles" icon="user" route="/roles" />}
        {auth.isSuperAdmin && <SidebarLink title="Permissions" icon="user" route="/permissions" />}
        <SidebarLink title="Users" icon="users" route="/users" />
        {auth.isSuperAdmin && <SidebarLink title="Physical Orders"  icon="file-empty" route="/physical-orders" />}
        <SidebarLink title="Domains"  icon="layers" route="/domains" />
      </ul>
      <ul className="sidebar__block">
        <SidebarCategory title="Choose Theme" icon="layers">
          <button type="button" className="sidebar__link" onClick={changeToLight}>
            <p className="sidebar__link-title">Light Theme</p>
          </button>
          <button type="button" className="sidebar__link" onClick={changeToDark}>
            <p className="sidebar__link-title">Dark Theme</p>
          </button>
        </SidebarCategory>
      </ul>
    </div>
  );
};

SidebarContent.propTypes = {
  changeToDark: PropTypes.func.isRequired,
  changeToLight: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withRouter(connect((state) => ({ 
  auth: state.auth
}))(SidebarContent));
