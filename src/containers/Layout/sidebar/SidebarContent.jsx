import React from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import {logout} from '../../App/auth';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const SidebarContent = ({ onClick, changeToDark, changeToLight, auth }) => {

  if( !auth ) return 'Loading...'

  const ProtectedLink = ({type}) => {
    if( !auth.isSuperAdmin ) return null;
    switch (type)
    {
      case 'merchants':
        return (
          <SidebarLink title="Merchants"  icon="store" route="/merchants" />
        );
      break;
      case 'reports':
        return (
          <>
            <SidebarLink title="Cash Deposit" route="/reports/cash-deposit" />
            <SidebarLink title="Inventory" route="/reports/inventory" />
            <SidebarLink title="Orders" route="/reports/orders" />
            <SidebarLink title="Journal Detailed" route="/reports/journal-detailed" />
            <SidebarLink title="Points Reserve" route="/reports/points-reserve" />
            <SidebarLink title="Program Status" route="/reports/program-status" />
            <SidebarLink title="Supplier Redemption" route="/reports/supplier-redemption" />
            <SidebarLink title="Expire Points" route="/reports/expire-points" />
            <SidebarLink title="Expire Monies" route="/reports/expire-monies" />
            <SidebarLink title="Deposit Transfer" route="/reports/deposit-transfer" />
            <SidebarLink title="Trial Balance" route="/reports/trial-balance" />
            <SidebarLink title="Points Purchase Summary" route="/reports/points-purchase-summary" />
          </>
        )
      break;
      case 'roles':
        return (
          <SidebarLink title="Roles" icon="user" route="/roles" />
        )
      break;
      case 'permissions':
        return (
          <SidebarLink title="Permissions" icon="user" route="/permissions" />
        )
      break;
      case 'physicalorders':
        return (
          <SidebarLink title="Physical Orders"  icon="file-empty" route="/physical-orders" />
        )
      break;
      default:
      break;
    }
  }

  return (
    <div className="sidebar__content">
      <ul className="sidebar__block">
        <SidebarLink title="Log Out" icon="exit" route="" onClick={logout} />
      </ul>
      <ul className="sidebar__block">
        <SidebarLink title="Programs" route="/program" icon="diamond" />
        {/*<SidebarCategory title="Program" icon="diamond">*/}
        {/*  <SidebarLink title="All Programs" route="/program" />*/}
        {/*  <SidebarLink title="Create Program" route="/program/add" />*/}
        {/*</SidebarCategory>*/}
        {
          auth?.isSuperAdmin &&
            <ProtectedLink type="merchants"/>
        }
        <SidebarCategory title="Import" icon="download">
          <SidebarLink title="All Imported Files" route="/import/list" />
          <SidebarLink title="Import" route="/import" />
        </SidebarCategory>
        {
            auth?.isSuperAdmin &&
            <SidebarCategory title="Reports" icon="book">
              <ProtectedLink type="reports"/>
              <SidebarLink title="Award Detail" route="/reports/award-detail"/>
              <SidebarLink title="Inventory Order" route="/reports/inventory-order"/>
              <SidebarLink title="Deposit" route="/reports/deposit"/>
              <SidebarLink title="Unassigned Program Domains" route="/reports/unassigned-program-domains"/>
              <SidebarLink title="Monies Pending Amount" route="/reports/monies-pending-amount"/>
              {/*<SidebarLink title="Participant Status Summary" route="/reports/participant-status-summary"/>*/}
              {/* <SidebarLink title="Participant Account Summary" route="/reports/participant-account-summary"/> */}

            </SidebarCategory>
        }
        {
            auth?.isSuperAdmin &&
            <ProtectedLink type="roles"/> &&
          <ProtectedLink type="permissions" />
        }
        <SidebarLink title="Users" icon="users" route="/users" />
        {
            auth?.isSuperAdmin &&
            <ProtectedLink type="physicalorders"/>
        }
        <SidebarLink title="Domains"  icon="layers" route="/domains" />
      </ul>
      {
          auth?.isSuperAdmin &&
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
      }
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
