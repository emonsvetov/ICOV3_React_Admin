import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddEventForm from './components/AddEventForm';

const AddEvent = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Events</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/events">Events</Link></h3>
      </Col>
    </Row>
    <Row>
      <AddEventForm />
    </Row>
  </Container>
);

export default AddEvent;
