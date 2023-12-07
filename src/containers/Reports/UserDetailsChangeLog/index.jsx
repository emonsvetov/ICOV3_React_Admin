import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import UserDetailsChangeLogsCard from './components/UserDetailChangeLogsIndex.jsx';

const UserDetailsChangeLogs = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">User Details Change Logs For All the Programs</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / User Details Change Logs</h3>
        </Col>
      </Row>
      <Row>
        <UserDetailsChangeLogsCard />
      </Row>
    </Container>
)}

export default UserDetailsChangeLogs;
