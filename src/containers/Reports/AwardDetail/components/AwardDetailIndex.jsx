import React, {useState} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import AwardDetailIndexDataTable from './AwardDetailIndexDataTable';

const AwardDetailIndex = () => {

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <AwardDetailIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default AwardDetailIndex;
