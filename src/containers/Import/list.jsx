import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import ImportListDataTable from './components/ImportListDataTable';

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
        <Col md={12}>
          <Card>
            <CardBody>
              <ImportListDataTable/>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
)}

export default ImportList;

