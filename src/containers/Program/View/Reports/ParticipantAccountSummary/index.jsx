import React from 'react';
import { Container, Row } from 'reactstrap';
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
