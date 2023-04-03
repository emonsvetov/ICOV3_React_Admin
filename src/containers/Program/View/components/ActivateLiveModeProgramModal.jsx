import React, {useState} from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LiveModeForm from '../../components/LiveModeForm';

const ActivateLiveModeProgramModal = ({data, isOpen, toggle, theme, rtl, organization}) => {
    return (
    <Modal className={`modal-program modal-program-md modal-md ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
        <ModalBody className='modal-md'>
            <LiveModeForm organization={organization} program={data} toggle={toggle} />
        </ModalBody>
    </Modal>
    )
}

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization,
  data: state.program
}))(ActivateLiveModeProgramModal));