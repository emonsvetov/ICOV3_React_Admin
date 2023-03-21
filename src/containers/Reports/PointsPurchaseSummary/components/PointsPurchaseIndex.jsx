import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import PointsPurchaseTable from './PointsPurchaseTable';

const PointsPurchaseIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <PointsPurchaseTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default PointsPurchaseIndex;
