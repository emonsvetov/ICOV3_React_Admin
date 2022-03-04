import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditPermissionForm from './components/EditPermissionForm';

const EditPermission = ( {organization} ) => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Permissions</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/permissions">Permissions</Link> / Edit Permission</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <EditPermissionForm organization={organization} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);
export default withRouter(connect((state) => ({
    organization: state.organization
}))(EditPermission));
// export default EditPermission;
