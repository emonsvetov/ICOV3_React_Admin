import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import JournalDetailedTable from './JournalDetailedTable';

const JournalDetailedIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <JournalDetailedTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default JournalDetailedIndex;
