import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditDomainForm from './components/EditDomainForm';

const EditDomain = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Domains</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/domains">Domains</Link> / Edit Domain</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <EditDomainForm />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default EditDomain;
