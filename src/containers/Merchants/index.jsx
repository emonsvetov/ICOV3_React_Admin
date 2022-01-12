import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import MerchantsIndexDataTable from './components/MerchantsIndexDataTable';

const MerchantsIndex = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">All Merchants</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Merchants</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                    <MerchantsIndexDataTable />
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

export default MerchantsIndex;
