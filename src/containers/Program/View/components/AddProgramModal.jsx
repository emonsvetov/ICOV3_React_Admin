import React, {useState} from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import AddProgramForm from '../../components/AddProgramForm';

const AddProgramModal = ({data, isOpen, toggle, theme, rtl, organization}) => {
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
        <ModalBody className='modal-lg'>
            <AddProgramForm organization={organization} program={data} toggle={toggle} />
            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>
        </ModalBody>
    </Modal>
    )
}
AddProgramModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  organization: Object.isRequired,
  data: Object.isRequired
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization,
  data: state.program
}))(AddProgramModal));