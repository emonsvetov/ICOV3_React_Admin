import React, {useState} from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import axios from 'axios'
import AddProgramForm from '../../components/AddProgramForm';

const AddProgramModal = ({data, isOpen, setOpen, toggle, theme, rtl, organization}) => {
    var [data, setData] = useState(data)
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={toggle}>
        <ModalBody className='modal-lg'>
            <AddProgramForm organization={organization} program={data} toggle={toggle} />
            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>
        </ModalBody>
    </Modal>
    )
}
export default AddProgramModal;