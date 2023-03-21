import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ProgramStatusCard from './components/ProgramStatusIndex.jsx';

const ProgramStatus = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Program Status</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Program Status</h3>
        </Col>
      </Row>
      <Row>
        <ProgramStatusCard />
      </Row>
    </Container>
  )}

export default ProgramStatus;
