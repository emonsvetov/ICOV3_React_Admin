import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import PointsReserveCard from './components/PointsReserveIndex.jsx';

const PointsReserve = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Points Reserve</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Points Reserve</h3>
        </Col>
      </Row>
      <Row>
        <PointsReserveCard />
      </Row>
    </Container>
)}

export default PointsReserve;
