import React, { useState } from 'react';
import {
  Nav, NavItem, NavLink, TabContent, TabPane 
} from 'reactstrap';
import classnames from 'classnames';
import IconUpload from './IconUpload';
import EventIcons from './EventIcons';

const Tabs = (props) => {
  
  const [activeTab, setActiveTab] = useState(props.activeTab);

  const [icon, setIcon] = useState(props.icon) //for selected icon
  const [icons, setIcons] = useState([])

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="tabs__wrap">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => toggle('1')}
          >
            Upload Files
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => toggle('2')}
          >
            Library
          </NavLink>
        </NavItem>
        
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
            <IconUpload toggle={toggle} setIcons={setIcons} onCancel={props.onCancel} />
        </TabPane>
        <TabPane tabId="2">
          <EventIcons setIcon={setIcon} onCancel={props.onCancel} onSelectIconOK={props.onSelectIconOK} setIcons={setIcons} icons={icons} icon={icon} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Tabs;
