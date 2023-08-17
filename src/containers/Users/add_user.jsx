import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AddUserForm from './Add/components/AddUserForm';

const AddUserPage = ({organization}) => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Users</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/users">Users</Link></h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
              <AddUserForm organization={organization} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);
export default withRouter(connect((state) => ({
  organization: state.organization
}))(AddUserPage));
