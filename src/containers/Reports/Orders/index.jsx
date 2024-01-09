import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import OrdersReportCard from "./components/OrdersIndex.jsx";

const Orders = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Orders</h3>
          <h3 className="page-subhead subhead">
            <Link to="/">Home</Link> / Orders
          </h3>
        </Col>
      </Row>
      <Row>
        <OrdersReportCard />
      </Row>
    </Container>
  );
};

export default Orders;
