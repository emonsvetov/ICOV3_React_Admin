import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import InventoryIndexDataTable from './InventoryIndexDataTable';

const InventoryIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <InventoryIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default InventoryIndex;
