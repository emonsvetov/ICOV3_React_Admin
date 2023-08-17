import React from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import ImportViewCard from "./components/ImportView";
import { IMPORT_DATA } from "./components/MockData";

const ImportView = () => {
  const { id } = useParams();
  const item = IMPORT_DATA.filter((item) => {
    return item.id == id;
  }).pop();

  if (!item) return "Loading... ";

  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">All Imported Files</h3>
          <h3 className="page-subhead subhead">
            <Link className="" to="/">
              Home
            </Link>
            &nbsp;/{" "}
            <Link className="" to="/import/list">
              Files
            </Link>
            &nbsp;/ {item.name}
          </h3>
        </Col>
      </Row>
      <Row>
        <ImportViewCard item={item} />
      </Row>
    </Container>
  );
};

export default ImportView;
