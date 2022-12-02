import React, {useState} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import ProgramStatusIndexDataTable from './ProgramStatusIndexDataTable.jsx';

const ProgramStatusIndex = () => {

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <ProgramStatusIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default ProgramStatusIndex;
