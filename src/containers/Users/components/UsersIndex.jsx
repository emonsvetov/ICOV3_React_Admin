import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import UsersIndexDataTable from './UsersIndexDataTable';

const UsersIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <UsersIndexDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default UsersIndex;
