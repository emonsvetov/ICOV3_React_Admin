import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import AddMerchantForm from './components/AddMerchant';

const AddMerchant = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <h3 className="page-title">Merchants</h3>
        <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/merchants">Merchants</Link> / Add Merchant</h3>
      </Col>
    </Row>
    <Row>
      <AddMerchantForm />
    </Row>
  </Container>
);

export default AddMerchant;
