import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ExpirePointsCard from './components/ExpirePointsIndex.jsx';

const ExpirePoints = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Expire Points</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Expire Points</h3>
        </Col>
      </Row>
      <Row>
        <ExpirePointsCard />
      </Row>
    </Container>
)}

export default ExpirePoints;
