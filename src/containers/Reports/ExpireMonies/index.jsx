import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ExpireMoniesCard from './components/ExpireMoniesIndex.jsx';

const ExpireMonies = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Expire Monies</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Expire Monies</h3>
        </Col>
      </Row>
      <Row>
        <ExpireMoniesCard />
      </Row>
    </Container>
)}

export default ExpireMonies;
