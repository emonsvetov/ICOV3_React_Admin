import React, {useState} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import FolderPlusOutlineIcon from 'mdi-react/FolderPlusOutlineIcon';
import AddMerchantForm from './AddMerchantForm';

const AddMerchant = () => {
  return(
  <Col md={12}>
    <Card>
      <CardBody style={{display:'flex'}}>
        <AddMerchantForm />
      </CardBody>
    </Card>
  </Col>
)};

export default AddMerchant;
