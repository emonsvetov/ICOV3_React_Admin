import React, {useState} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import classnames from 'classnames';

import { Modal, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import AddProgramUserForm from './AddProgramUserForm'

const AddProgramUserModal = ({organization, program, isOpen, setOpen, toggle, theme, rtl, setTrigger}) => {
    const [activeTab, setActiveTab] = useState('1');
    const tabToggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    if(!organization?.id || !program?.id) return 'Loading...'
    return (
        <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
            <div className="tabs__wrap">
                <Nav tabs>
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => tabToggle('1')}
                    >
                        New User
                    </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => tabToggle('2')}
                    >
                        Available Users
                    </NavLink>
                    </NavItem>
                    
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <AddProgramUserForm organization={organization} program={program} toggle={toggle} setTrigger={setTrigger} />
                    </TabPane>
                    <TabPane tabId="2">
                        User Lab
                    </TabPane>
                </TabContent>
                </div>
        </Modal>
    )
}
AddProgramUserModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(AddProgramUserModal));

