import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import AwardDetailCard from './components/AwardDetailIndex.jsx';

const AwardDetail = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Award Detail</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Award Detail</h3>
        </Col>
      </Row>
      <Row>
        <AwardDetailCard />
      </Row>
    </Container>
)}

export default AwardDetail;
