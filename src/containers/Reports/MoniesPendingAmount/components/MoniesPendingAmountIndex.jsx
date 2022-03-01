import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import MoniesIndexDataTable from './MoniesIndexDataTable';

const MoniesPendingAmountIndex = () => {
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <MoniesIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default MoniesPendingAmountIndex;
