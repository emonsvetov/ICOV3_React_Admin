import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import ImportUserForm from './Import/ImportUserForm';

const ImportUser = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Import</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/users">Import Users</Link></h3>
      </Col>
    </Row>
    <Row>
    <Col md={12}>
    <Card>
      <CardBody style={{display:'flex'}}>
      <ImportUserForm />
      </CardBody>
      </Card>
      </Col>
    </Row>
  </Container>
);

export default ImportUser;
