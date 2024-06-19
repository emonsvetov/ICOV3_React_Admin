import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import ServerIpsTable from "../ServerIps/components/ServerIpsIndexDataTable";

const ServerIpsIndex = () => {
    return (
        <Container className="dashboard">
            <Row>
                <Col md={12}>
                    <h3 className="page-title">Server Ips for Domains</h3>
                    <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link></h3>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <ServerIpsTable />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )}

export default ServerIpsIndex;
