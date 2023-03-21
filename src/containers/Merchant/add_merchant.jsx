import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddMerchantForm from './components/AddMerchantForm';

const AddMerchant = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Merchants</h3>
        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/merchants">Merchants</Link> / Add Merchant</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <Card>
          <CardBody style={{display:'flex'}}>
            <AddMerchantForm />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default AddMerchant;
