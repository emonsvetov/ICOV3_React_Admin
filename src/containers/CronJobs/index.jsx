import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import CronJobsIndexDataTable from "../CronJobs/components/CronJobsIndexDataTable";

const MerchantsIndex = () => {
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Cron Jobs</h3>
          <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link></h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
            <Card>
                <CardBody>
                  <CronJobsIndexDataTable />
                </CardBody>
            </Card>
        </Col>
      </Row>
    </Container>
)}

export default MerchantsIndex;
