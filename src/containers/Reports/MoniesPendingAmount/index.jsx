import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import MoniesCard from './components/MoniesPendingAmountIndex.jsx';

const MoniesPendingAmount = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Monies Pending Amount</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Monies Pending Amount</h3>
        </Col>
      </Row>
      <Row>
        <MoniesCard />
      </Row>
    </Container>
)}


export default MoniesPendingAmount;
