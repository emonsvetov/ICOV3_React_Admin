import React from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

const SidebarContent = ({ onClick, changeToDark, changeToLight }) => {
  const handleHideSidebar = () => {
    onClick();
  };

  return (
    <div className="sidebar__content">
      <ul className="sidebar__block">
        <SidebarLink title="Log In" icon="exit" route="/log_in" onClick={handleHideSidebar} />
        <SidebarCategory title="Layout" icon="layers">
          <button type="button" className="sidebar__link" onClick={changeToLight}>
            <p className="sidebar__link-title">Light Theme</p>
          </button>
          <button type="button" className="sidebar__link" onClick={changeToDark}>
            <p className="sidebar__link-title">Dark Theme</p>
          </button>
        </SidebarCategory>
      </ul>
      <ul className="sidebar__block">
        <SidebarCategory title="Program" icon="diamond">
          <SidebarLink title="All Programs" route="/program" onClick={handleHideSidebar} />
          <SidebarLink title="Create Program" route="/program/create" onClick={handleHideSidebar} />
        </SidebarCategory>
        <SidebarLink title="Merchant"  icon="store" route="/merchant" />
        <SidebarLink title="Import"  icon="download" route="/import" />
        <SidebarLink title="Reports"  icon="book" route="/reports" />
        <SidebarLink title="Roles"  icon="user" route="/roles" />
        <SidebarLink title="Users"  icon="users" route="/users" />
        <SidebarLink title="Events"  icon="calendar-full" route="/events" />
        <SidebarLink title="Invoices"  icon="file-empty" route="/invoices" />
        <SidebarLink title="Domains"  icon="layers" route="/domains" />
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
