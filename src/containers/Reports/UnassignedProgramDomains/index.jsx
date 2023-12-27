import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import UnassignedProgramDomainsCard from './components/UnassignedProgramDomainIndex.jsx';

const UnassignedProgramDomains = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Unassigned Program Domains</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Unassigned Program Domains</h3>
        </Col>
      </Row>
      <Row>
        <UnassignedProgramDomainsCard />
      </Row>
    </Container>
)}

export default UnassignedProgramDomains;
