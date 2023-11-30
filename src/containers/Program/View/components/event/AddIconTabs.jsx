import React, { useState } from 'react';
import {
  Nav, NavItem, NavLink, TabContent, TabPane 
} from 'reactstrap';
import classnames from 'classnames';
import UploadIcon from './icon/UploadIcon';
import ListIcons from './icon/ListIcons';

const AddIconTabs = (props) => {
  
  const [activeTab, setActiveTab] = useState(props.activeTab);

  const [icon, setIcon] = useState(props.icon) //for selected icon
  const [icons, setIcons] = useState([])
  const [defaultIcons, setDefaultIcons] = useState([]);
  const [iconUploadType, setIconUploadType] = useState('global')

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
            Upload Icon
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
            <UploadIcon toggle={toggle} defaultIcons={defaultIcons} setDefaultIcons={setDefaultIcons} setIcons={setIcons} onCancel={props.onCancel} program={props.program} iconUploadType={iconUploadType} />
        </TabPane>
        <TabPane tabId="2">
          <ListIcons setIcon={setIcon} onCancel={props.onCancel} onSelectIconOK={props.onSelectIconOK} setIcons={setIcons} defaultIcons={defaultIcons} setDefaultIcons={setDefaultIcons} icons={icons} icon={icon} program={props.program} setActiveTab={setActiveTab} setIconUploadType={setIconUploadType} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default AddIconTabs;
