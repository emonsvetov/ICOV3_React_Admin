import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddProgramForm from './components/AddProgramForm';
import FolderPlusOutlineIcon from 'mdi-react/FolderPlusOutlineIcon';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const AddProgram = ( {organization} ) => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Programs</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/program">Programs</Link></h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <Col md={4}>
            </Col>
            <Col md={4}>
              <div className="pb-4">
                <div  className='text-center'><FolderPlusOutlineIcon size={34} color='#70bbfd' /></div>
                <h3 className="text-center text-blue font-22">Create a new program</h3>
              </div>
              <AddProgramForm organization={organization} />
            </Col>
            <Col md={4}>
            </Col>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization
}))(AddProgram));
