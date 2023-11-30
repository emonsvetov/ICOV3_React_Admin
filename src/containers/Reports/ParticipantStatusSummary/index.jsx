import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ParticipantStatusSummaryCard from './components/ParticipantStatusSummaryIndex.jsx';

const ParticipantStatusSummary = () => {
  return (
    <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Participant Status Summary</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Participant Status Summary</h3>
      </Col>
    </Row>
    <Row>
      <ParticipantStatusSummaryCard />
    </Row>
  </Container>
  )
}

export default ParticipantStatusSummary;
