import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import ImportListCard from './components/ImportList';

const ImportList = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">All Imported Files</h3>
          <h3 className="page-subhead subhead">
            <Link className="" to="/">Home</Link>
            / Imported Files
          </h3>
        </Col>
      </Row>
      <Row>
        <ImportListCard />
      </Row>
    </Container>
)}

export default ImportList;

