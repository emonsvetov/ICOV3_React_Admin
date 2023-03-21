import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import UnassignedProgramDomainTable from './UnassignedProgramDomainTable';

const UnassignedIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <UnassignedProgramDomainTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default UnassignedIndex;
