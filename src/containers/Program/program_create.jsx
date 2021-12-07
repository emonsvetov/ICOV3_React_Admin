import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ProgramCreateForm from './components/ProgramCreate';

const ProgramCreate = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Create Program</h3>
      </Col>
    </Row>
    <Row>
      <ProgramCreateForm />
    </Row>
  </Container>
);

export default ProgramCreate;
