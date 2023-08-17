import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddRoleForm from './components/AddRoleForm';

const AddRole = ({organization}) => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Roles</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/roles">Roles</Link> / Add Role</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <AddRoleForm organization={organization} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);
export default withRouter(connect((state) => ({
  organization: state.organization
}))(AddRole));
