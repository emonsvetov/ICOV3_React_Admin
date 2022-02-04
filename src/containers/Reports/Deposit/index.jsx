import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import DepositCard from './components/DepositIndex.jsx';

const Deposit = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Deposit</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Deposit</h3>
        </Col>
      </Row>
      <Row>
        <DepositCard />
      </Row>
    </Container>
)}

export default Deposit;
