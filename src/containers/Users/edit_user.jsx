import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditUserForm from './Edit/components/EditUserForm';

const EditUserPage = ({organization}) => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Users</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/users">Users</Link> / Edit User</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            {organization?.id && <EditUserForm organization={organization}  />}
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);
export default withRouter(connect((state) => ({
  organization: state.organization
}))(EditUserPage));
