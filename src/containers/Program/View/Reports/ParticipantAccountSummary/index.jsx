import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ParticipantAccountSummaryCard from './components/ParticipantAccountSummaryIndex.jsx';

const ParticipantAccountSummary = ({program}) => {
  return (
    <Container className="dashboard">
    <Row>
      <ParticipantAccountSummaryCard program={program}/>
    </Row>
  </Container>
  )
}

export default ParticipantAccountSummary;
