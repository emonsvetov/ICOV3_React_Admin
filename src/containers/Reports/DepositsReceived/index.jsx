import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import MoniesCard from './components/DepositsReceivedIndex.jsx';

const DepositsReceived = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Deposits Received</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Deposits Received</h3>
        </Col>
      </Row>
      <Row>
        <MoniesCard />
      </Row>
    </Container>
)}


export default DepositsReceived;
