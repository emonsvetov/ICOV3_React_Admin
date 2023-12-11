import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ProgramParticipantStatusSummaryCard from './components/ProgramParticipantStatusSummaryIndex.jsx';

const ProgramParticipantStatusSummary = () => {
  return (
      <ProgramParticipantStatusSummaryCard />
  )
}

export default ProgramParticipantStatusSummary;
