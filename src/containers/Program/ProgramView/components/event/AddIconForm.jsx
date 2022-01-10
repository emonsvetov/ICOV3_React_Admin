import React, { useMemo, useState, useEffect } from "react";
import { Form, Field } from "react-final-form";

import {  
  Button,
  Card,
  CardBody,
  ButtonToolbar,
  Row,
  Col,
  
} from "reactstrap";


import Tabs from "./Tabs";

const AddIconForm = ( props ) => {
  

  const onClickCancel = () => {
    props.onStep(1)
  };

  const onClickOK = () => {
    props.onStep(1)
  };
  
  return (
    
        <Col md={12} lg={12}>
            <Row className='w100'>
                <Col md="6" lg="6" xl="6">
                    <h3>Insert Icon</h3>
                    
                </Col>
                <Col md="6" lg="6" xl="6" className='text-right'>
                
                    <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={ onClickCancel }> Cancel </Button>{' '}
                    <Button color="primary" className="mr-3" onClick = {onClickOK} > OK </Button>{' '}
                      
                    </ButtonToolbar>
                </Col>
            </Row>
            
          <div className="pt-5 tabs">
            <Tabs />
          </div>
         
        </Col>
      
  );
};


export default AddIconForm;
