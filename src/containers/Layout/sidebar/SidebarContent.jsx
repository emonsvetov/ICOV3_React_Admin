import React from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import {logout} from '../../App/auth';

const SidebarContent = ({ onClick, changeToDark, changeToLight }) => {
  const handleHideSidebar = () => {
    onClick();
  };

  return (
    <div className="sidebar__content">
      <ul className="sidebar__block">
        <SidebarLink title="Log Out" icon="exit" route="" onClick={logout} />
      </ul>
      <ul className="sidebar__block">
        <SidebarCategory title="Program" icon="diamond">
          <SidebarLink title="All Programs" route="/program" onClick={handleHideSidebar} />
          <SidebarLink title="Create Program" route="/program/add" onClick={handleHideSidebar} />
        </SidebarCategory>
        <SidebarLink title="Merchants"  icon="store" route="/merchants" />
        <SidebarLink title="Import"  icon="download" route="/import" />
        <SidebarCategory title="Reports" icon="book">
          <SidebarLink title="Inventory" route="/reports/inventory" onClick={handleHideSidebar} />
          <SidebarLink title="Inventory Order" route="/reports/inventory-order" onClick={handleHideSidebar} />
          <SidebarLink title="Journal Detailed" route="/reports/journal-detailed" onClick={handleHideSidebar} />
          <SidebarLink title="Points Purchase Summary" route="/reports/points-purchase-summary" onClick={handleHideSidebar} />
          <SidebarLink title="Points Reserve" route="/reports/points-reserve" onClick={handleHideSidebar} />
          <SidebarLink title="Program Status" route="/reports/program-staus" onClick={handleHideSidebar} />
          <SidebarLink title="Supplier Redemption" route="/supplier-redemption" onClick={handleHideSidebar} />
          <SidebarLink title="Trial Balance" route="/reports/trial-balance" onClick={handleHideSidebar} />
          <SidebarLink title="Deposit" route="/reports/deposit" onClick={handleHideSidebar} />
          <SidebarLink title="Unassigned Program Domains" route="/reports/unassigned-program-domains" onClick={handleHideSidebar} />
        </SidebarCategory>
        <SidebarLink title="Roles"  icon="user" route="/roles" />
        <SidebarLink title="Users"  icon="users" route="/users" />
        <SidebarLink title="Physical Orders"  icon="file-empty" route="/physical-orders" />
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

export default SidebarContent;
