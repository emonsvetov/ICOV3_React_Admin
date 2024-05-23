import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, Alert, ListGroup, ListGroupItem } from 'reactstrap';

const ViewConfigurationPage = () => {
    const { id } = useParams();
    const [configuration, setConfiguration] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfiguration = async () => {
            try {
                const response = await axios.get(`/tango-settings/view/${id}`);
                setConfiguration(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch configuration');
                setIsLoading(false);
                console.error(err);
            }
        };

        fetchConfiguration();
    }, [id]);

    if (isLoading) return <Container><Alert color="info">Loading...</Alert></Container>;
    if (error) return <Container><Alert color="danger">{error}</Alert></Container>;

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Configuration Details</h2>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            {configuration ? (
                                <>
                                    <CardTitle tag="h5">Configuration Information</CardTitle>
                                    <ListGroup>
                                        <ListGroupItem><strong>Name:</strong> {configuration.name}</ListGroupItem>
                                        <ListGroupItem><strong>Platform Name:</strong> {configuration.platform_name}</ListGroupItem>
                                        <ListGroupItem><strong>Platform URL:</strong> {configuration.platform_url}</ListGroupItem>
                                        <ListGroupItem><strong>Platform Mode:</strong> {configuration.platform_mode}</ListGroupItem>
                                        <ListGroupItem><strong>Account Identifier:</strong> {configuration.account_identifier}</ListGroupItem>
                                        <ListGroupItem><strong>Account Number:</strong> {configuration.account_number}</ListGroupItem>
                                        <ListGroupItem><strong>Customer Number:</strong> {configuration.customer_number}</ListGroupItem>
                                        <ListGroupItem><strong>UDID:</strong> {configuration.udid}</ListGroupItem>
                                        <ListGroupItem><strong>ETID:</strong> {configuration.etid}</ListGroupItem>
                                        <ListGroupItem><strong>Status:</strong> {configuration.status ? 'Active' : 'Inactive'}</ListGroupItem>
                                        <ListGroupItem><strong>Test Configuration:</strong> {configuration.is_test ? 'Yes' : 'No'}</ListGroupItem>
                                    </ListGroup>
                                </>
                            ) : (
                                <Alert color="warning">No configuration details available.</Alert>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewConfigurationPage;
