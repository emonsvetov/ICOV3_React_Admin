import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import PointsPurchaseCard from './components/PointsPurchaseIndex.jsx';

const PointsPurchaseSummary = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Points Purchase Summary</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Points Purchase</h3>
        </Col>
      </Row>
      <Row>
        <PointsPurchaseCard />
      </Row>
    </Container>
)}

export default PointsPurchaseSummary;
