import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddDomainForm from './components/AddDomainForm';

const AddDomain = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Domains</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/domains">Domains</Link> / Add Domain</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <AddDomainForm />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default AddDomain;
