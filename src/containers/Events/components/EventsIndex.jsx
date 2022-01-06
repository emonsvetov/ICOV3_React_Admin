import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
// import UsersIndexDataTable from './UsersIndexDataTable';
import EventsDataTable from './EventsDataTable';
const EventsIndex = () => {
  // const reactTableData = GetIndexData();
  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <EventsDataTable />
        </CardBody>
      </Card>
    </Col>
  )
}

export default EventsIndex;
