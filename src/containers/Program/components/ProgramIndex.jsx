import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import ProgramIndexDataTable from './ProgramIndexDataTable';
// import CustomDataTable from './CustomDataTable';
// import GetIndexData from './GetIndexData';
// import GetIndexData from '../../Tables/CreateData';

const ProgramIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <ProgramIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default ProgramIndex;
