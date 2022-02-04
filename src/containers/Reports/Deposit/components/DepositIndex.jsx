import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import DepositIndexDataTable from './DepositIndexDataTable';

const DepositIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <DepositIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default DepositIndex;
