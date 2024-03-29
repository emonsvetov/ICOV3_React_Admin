import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';

import { Modal } from 'reactstrap';
import EditProgramUserForm from './EditProgramUserForm'

const EditProgramUserModal = ({organization, program, userid, isOpen, setOpen, toggle, theme, rtl, setTrigger}) => {
    return (
        <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen}
               toggle={toggle}>
            {organization?.id && program?.id && <EditProgramUserForm organization={organization} program={program} userid={userid} toggle={toggle} setTrigger={setTrigger} />}
        </Modal>
    )
}
EditProgramUserModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl
}))(EditProgramUserModal));

