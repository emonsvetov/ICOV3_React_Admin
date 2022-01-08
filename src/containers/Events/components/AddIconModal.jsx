
import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Card,
  CardBody,
  ButtonToolbar,
  Row,
  Col,
  ModalFooter,
} from "reactstrap";

import axios from "axios";


import Tabs from "./Tabs";

const AddIconModal = ({
  isOpen,
  setOpen,
  toggle,
  
}) => {
  
  
  const [eventData, setEventData] = useState([]);
  
  
  return (
    <Modal
      className={`modal-program modal-lg`}
      isOpen={isOpen}
      toggle={() => setOpen(true)}
    >
    
            
    
      <ModalBody className="modal-lg">
        <Col md={12} lg={12}>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3>Insert Icon</h3>
                    
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">

                    <Button outline color="primary" className="mr-3" onClick={toggle}>Cancel</Button>{' '}
                    <Button color="primary" className="mr-3" onClick={toggle}>OK</Button>{' '}
                      
                    </ButtonToolbar>
                </Col>
            </Row>
            
          <div className="pt-5 tabs">
            <Tabs />
          </div>
         
        </Col>
      </ModalBody>
   

    </Modal>
  );
};


export default AddIconModal;
