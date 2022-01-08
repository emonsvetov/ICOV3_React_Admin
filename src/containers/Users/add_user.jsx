import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddUser from './Add/components/AddUser';

const AddUserPage = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Users</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/users">Users</Link></h3>
      </Col>
    </Row>
    <Row>
      <AddUser />
    </Row>
  </Container>
);

export default AddUserPage;
