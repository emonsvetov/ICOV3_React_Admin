import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import DepositBalanceCard from "./components/DepositBalanceIndex.jsx";

const DepositBalance = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Deposit Balance</h3>
          <h3 className="page-subhead subhead">
            <Link to="/">Home</Link> / Deposit Balance
          </h3>
        </Col>
      </Row>
      <Row>
        <DepositBalanceCard />
      </Row>
    </Container>
  );
};

export default DepositBalance;
