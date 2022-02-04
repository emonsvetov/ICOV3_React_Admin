import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import TrialBalanceCard from './components/TrialBalanceIndex.jsx';

const TrialBalance = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Trial Balance</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Trial Balance</h3>
        </Col>
      </Row>
      <Row>
        <TrialBalanceCard />
      </Row>
    </Container>
)}

export default TrialBalance;
