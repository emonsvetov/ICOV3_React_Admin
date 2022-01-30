import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditOrderForm from './components/EditOrderForm';

const EditOrder = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Orders Detail</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/physical-orders">Physical Orders</Link> / Edit Physical Order</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <EditOrderForm />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default EditOrder;
