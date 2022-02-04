import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import InventoryOrderCard from './components/InventoryOrderIndex.jsx';

const InventoryOrder = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Inventory Order</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Inventory Order</h3>
        </Col>
      </Row>
      <Row>
        <InventoryOrderCard />
      </Row>
    </Container>
)}

export default InventoryOrder;
