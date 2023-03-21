import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditDomainForm from './components/EditDomainForm';

const EditDomain = ( {organization} ) => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Domains</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/domains">Domains</Link> / Edit Domain</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <EditDomainForm organization={organization} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);
export default withRouter(connect((state) => ({
    organization: state.organization
}))(EditDomain));
// export default EditDomain;
