import React, { useEffect, useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import OrdersTable from "./OrdersTable";
import axios from "axios";
import { isEmpty } from "@/shared/helpers";
import { connect } from "react-redux";
import { getAllPrograms } from "@/shared/apiHelper.jsx";

const OrdersIndex = ({ organization }) => {
  const [defaultPrograms, setDefaultPrograms] = useState([]);

  return (
    <Col md={12}>
      <Card>
        <CardBody>
          <OrdersTable />
        </CardBody>
      </Card>
    </Col>
  );
};

const mapStateToProps = (state) => {
  return {
    organization: state.organization,
  };
};
export default connect(mapStateToProps)(OrdersIndex);
