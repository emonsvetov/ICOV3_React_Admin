import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import TrialBalanceTable from './TrialBalanceTable';

const TrialBalanceIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <TrialBalanceTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default TrialBalanceIndex;
