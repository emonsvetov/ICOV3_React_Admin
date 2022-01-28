import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import TangoOrderDetail from './components/TangoOrderDetail';

const EditOrder = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Tango Order's Details</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Tango Orders Detail</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <TangoOrderDetail />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default EditOrder;
