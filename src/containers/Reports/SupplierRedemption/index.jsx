import React from 'react';
import {Link} from 'react-router-dom';
import {Col, Container, Row} from 'reactstrap';
import SupplierRedemptionCard from './components/SupplierRedemptionIndex.jsx';

const SupplierRedemption = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Supplier Redemption</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Supplier Redemption</h3>
        </Col>
      </Row>
      <Row>
        <SupplierRedemptionCard/>
      </Row>
    </Container>
  )
}

export default SupplierRedemption;
