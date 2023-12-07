import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ParticipantAccountSubProgramCard from './components/ParticipantAccountSubProgramIndex.jsx';

const ParticipantAccountSubProgram = () => {
  return (
    <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Participant Accounts by Subprogram</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Participant Accounts by Subprogram</h3>
      </Col>
    </Row>
    <Row>
      <ParticipantAccountSubProgramCard />
    </Row>
  </Container>
  )
}

export default ParticipantAccountSubProgram;
