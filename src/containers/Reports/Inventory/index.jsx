import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import InventoryIndexDataTable from './components/InventoryIndexDataTable';

const Inventory = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Inventory</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Inventory</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <InventoryIndexDataTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
)}

export default Inventory;
