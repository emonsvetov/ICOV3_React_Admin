import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import ProgramStatusTable from './ProgramStatusTable';

const ProgramStatusIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <ProgramStatusTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default ProgramStatusIndex;
