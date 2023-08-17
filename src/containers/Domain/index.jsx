import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import DomainIndexDataTable from './components/DomainIndexDataTable';

const DomainIndex = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">All Domains</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Domains</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                    <DomainIndexDataTable />
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

// export default withRouter(connect((state) => ({
//   organization: state.organization
// }))(DomainIndex)); //if you need it ever!

export default DomainIndex;
