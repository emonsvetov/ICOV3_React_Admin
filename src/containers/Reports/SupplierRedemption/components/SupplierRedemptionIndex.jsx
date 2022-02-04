import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import SupplierRedemptionTable from './SupplierRedemptionTable';

const SupplierRedemptionIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <SupplierRedemptionTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default SupplierRedemptionIndex;
