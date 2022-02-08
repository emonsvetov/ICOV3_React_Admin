import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import PointsReserveTable from './PointsReserveTable';

const PointsReserveIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <PointsReserveTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default PointsReserveIndex;
