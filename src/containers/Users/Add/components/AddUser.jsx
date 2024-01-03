import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import AddUserForm from './AddUserForm';

const AddUser = () => (
  <Col md={12}>
    <Card>
      <CardBody style={{display:'flex'}}>
          <AddUserForm />
      </CardBody>
    </Card>
  </Col>
)

export default AddUser;
