import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditMerchantForm from './components/EditMerchantForm';

const EditMerchant = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Merchants</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/merchants">Merchants</Link> / Edit Merchant</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <EditMerchantForm />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default EditMerchant;
