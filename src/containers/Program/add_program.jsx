import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddProgramForm from './components/AddProgram';

const AddProgram = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Programs</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link></h3>
      </Col>
    </Row>
    <Row>
      <AddProgramForm />
    </Row>
  </Container>
);

export default AddProgram;
