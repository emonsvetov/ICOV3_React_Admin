import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';

import { Modal } from 'reactstrap';
import AddProgramUserForm from './AddProgramUserForm'

const AddProgramUserModal = ({organization, program, isOpen, setOpen, toggle, theme, rtl, setTrigger}) => {
    return (
        <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
            {organization?.id && program?.id && <AddProgramUserForm organization={organization} program={program} toggle={toggle} setTrigger={setTrigger} />}
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

