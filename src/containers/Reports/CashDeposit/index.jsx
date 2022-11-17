import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import CashDepositCard from './components/CashDepositIndex.jsx';

const CashDeposit = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Cash Deposit</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Cash Deposit</h3>
        </Col>
      </Row>
      <Row>
        <CashDepositCard />
      </Row>
    </Container>
)}

export default CashDeposit;
