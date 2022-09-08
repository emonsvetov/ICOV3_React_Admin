import React from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import ImportListDataTable from './ImportListDataTable';

const ImportList = () => {
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <ImportListDataTable/>
        </CardBody>
      </Card>
    </Col>
  )
}

export default ImportList;
