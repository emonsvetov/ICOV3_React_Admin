import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardBody, Col, Container, Row } from 'reactstrap';
import TangoSettingsIndexDataTable from "../TangoSettings/components/TangoSettingsIndexDataTable";

const TangoSettingsIndex = () => {
    return (
        <Container className="dashboard">
            <Row>
                <Col md={12}>
                    <h3 className="page-title">Tango Settings</h3>
                    <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link></h3>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <TangoSettingsIndexDataTable />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )}

export default TangoSettingsIndex;
