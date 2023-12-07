import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import DepositTransferCard from './components/DepositTransferIndex.jsx';

const DepositTransfer = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Deposit Transfer</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Deposit Transfer</h3>
        </Col>
      </Row>
      <Row>
        <DepositTransferCard />
      </Row>
    </Container>
)}

export default DepositTransfer;
