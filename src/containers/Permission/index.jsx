import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import PermissionIndexDataTable from './components/PermissionIndexDataTable';

const PermissionIndex = ({organization}) => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Permissions</h3>
          <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Permissions</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                    { ! organization?.id  && 'Loading...'}
                    {organization?.id && <PermissionIndexDataTable organization={organization} />}
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(PermissionIndex)); //if you need it ever!

// export default PermissionIndex;
