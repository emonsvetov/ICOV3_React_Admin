import React, {useState} from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import axios from 'axios'
import AddProgram from '../../components/AddProgram';

const AddProgramModal = ({data, isOpen, setOpen, toggle, theme, rtl}) => {
    var [data, setData] = useState(data)
    return (
    <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} isOpen={isOpen} toggle={() => setOpen(true)}>
        <ModalBody className='modal-lg'>
            <AddProgram program={data} toggle={toggle} />
            <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>
        </ModalBody>
    </Modal>
    )
}
export default AddProgramModal;