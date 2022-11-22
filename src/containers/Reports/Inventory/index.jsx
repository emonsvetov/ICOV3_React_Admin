import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import InventoryIndex from './components/InventoryIndex.jsx';

const Inventory = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Inventory</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Inventory</h3>
        </Col>
      </Row>
      <Row>
        <InventoryIndex />
      </Row>
    </Container>
  )}

export default Inventory;
