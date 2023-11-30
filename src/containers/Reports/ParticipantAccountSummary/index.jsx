import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ParticipantAccountSummaryCard from './components/ParticipantAccountSummaryIndex.jsx';

const ParticipantAccountSummary = () => {
  return (
    <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Participant Account Summary</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Participant Account Summary</h3>
      </Col>
    </Row>
    <Row>
      <ParticipantAccountSummaryCard />
    </Row>
  </Container>
  )
}

export default ParticipantAccountSummary;
