import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import InventoryOrderTable from './InventoryOrderTable';

const InventoryOrderIndex = () => {
  
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <InventoryOrderTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default InventoryOrderIndex;
