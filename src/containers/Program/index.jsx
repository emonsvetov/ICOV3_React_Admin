import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import ProgramIndexCard from './components/ProgramIndex';

const ProgramIndex = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">All Programs</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Programs</h3>
      </Col>
    </Row>
    <Row>
      <ProgramIndexCard />
    </Row>
  </Container>
);

export default ProgramIndex;
