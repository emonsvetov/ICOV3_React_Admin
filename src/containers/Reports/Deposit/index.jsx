import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import DepositCard from './components/DepositIndex.jsx';

const Deposit = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Invoice Created</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Deposit</h3>
        </Col>
      </Row>
      <Row>
        <DepositCard />
      </Row>
    </Container>
)}

export default Deposit;
