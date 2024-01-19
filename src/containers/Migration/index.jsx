import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import MigrationCard from './components/MigrationIndex.jsx';

const Migration = () => {
    return (
        <Container className="dashboard">
            <Row>
                <Col md={12}>
                    <h3 className="page-title">Migration</h3>
                    <h3 class="page-subhead subhead"><Link className="" to="/">Home</Link> / Migration</h3>
                </Col>
            </Row>
            <Row>
                <MigrationCard />
            </Row>
        </Container>
    )
}

export default Migration;