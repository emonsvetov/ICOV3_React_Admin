import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import AddEventForm from './AddEventForm';

const AddEvent = () => (
  <Col md={12}>
    <Card>
      <CardBody style={{display:'flex'}}>
          <AddEventForm />
      </CardBody>
    </Card>
  </Col>
)

export default AddEvent;
