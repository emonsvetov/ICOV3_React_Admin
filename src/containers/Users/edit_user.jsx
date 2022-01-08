import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditUser from './Edit/components/EditUser';

const EditUserPage = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Users</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/users">Users</Link> / Edit User</h3>
      </Col>
    </Row>
    <Row>
      <EditUser />
    </Row>
  </Container>
);

export default EditUserPage;
