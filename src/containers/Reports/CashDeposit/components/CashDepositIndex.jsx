import React, {useState} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import CashDepositIndexDataTable from './CashDepositIndexDataTable';

const AwardDetailIndex = () => {

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <CashDepositIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default AwardDetailIndex;
