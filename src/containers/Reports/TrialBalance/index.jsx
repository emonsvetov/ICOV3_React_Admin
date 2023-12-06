import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import TrialBalanceReportCard from './components/TrialBalanceIndex.jsx';

const TrialBalance = () => {
    return (
        <Container className="dashboard">
            <Row>
                <Col md={12}>
                    <h3 className="page-title">Trial Balance</h3>
                    <h3 className="page-subhead subhead"><Link to="/">Home</Link> / Trial Balance</h3>
                </Col>
            </Row>
            <Row>
                <TrialBalanceReportCard/>
            </Row>
        </Container>
    )
}

export default TrialBalance;
