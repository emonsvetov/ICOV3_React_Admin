import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import RoleIndexDataTable from './components/RoleIndexDataTable';

const RoleIndex = ({organization}) => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Roles</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Roles</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                    { ! organization?.id  && 'Loading...'}
                    {organization?.id && <RoleIndexDataTable organization={organization} />}
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

export default withRouter(connect((state) => ({
  organization: state.organization
}))(RoleIndex)); //if you need it ever!

// export default RoleIndex;
