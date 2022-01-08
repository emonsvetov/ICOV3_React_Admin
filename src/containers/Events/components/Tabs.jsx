import React, { useState } from 'react';
import {
  Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap';
import classnames from 'classnames';

import showResults from '@/utils/showResults';
import DropFiles from './DropFiles';
const Tabs = () => {
  const [activeTab, setActiveTab] = useState('1');

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
            <DropFiles onSubmit={showResults} />
        </TabPane>
        <TabPane tabId="2">
          
        </TabPane>
        
      </TabContent>
    </div>
  );
};

export default Tabs;
