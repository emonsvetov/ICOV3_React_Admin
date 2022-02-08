import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import JournalDetailedCard from './components/JournalDetailedIndex.jsx';

const JournalDetailed = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Journal Detailed</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / JournalDetailed</h3>
        </Col>
      </Row>
      <Row>
        <JournalDetailedCard />
      </Row>
    </Container>
)}

export default JournalDetailed;
