import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Alert, ListGroup, ListGroupItem, Button } from 'reactstrap';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const ViewConfigurationPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [configuration, setConfiguration] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

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

    const handleDelete = async () => {
        try {
            await axios.delete(`/tango-settings/delete/${id}`);
            history.push('/tango-settings');
            alert('Configuration successfully deleted.');
        } catch (error) {
            alert('Failed to delete configuration.');
            console.error(error);
        }
    };

    if (isLoading) return <Container>Loading...</Container>;
    if (error) return <Container><Alert color="danger">{error}</Alert></Container>;

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Tango Configuration Details</h2>
                    <Button color="#70bbfd" onClick={() => history.push(`/tango-settings/edit/${id}`)} style={{ marginRight: '10px', backgroundColor: '#70bbfd', borderColor: '#70bbfd', color: '#000'}}>Edit</Button>
                    <Button color="#70bbfd" onClick={() => setModalOpen(true)}  style={{ marginRight: '10px',  backgroundColor: '#70bbfd', borderColor: '#70bbfd', color: '#000' }}>Delete</Button>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            {configuration ? (
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
                                    <ListGroupItem><strong>Status:</strong> {parseInt(configuration.status) === 1 ? 'Active' : 'Inactive'}</ListGroupItem>
                                    <ListGroupItem><strong>Test Configuration:</strong> {parseInt(configuration.is_test) === 0 ? 'Yes' : 'No'}</ListGroupItem>
                                </ListGroup>
                            ) : (
                                <Alert color="warning">No configuration details available.</Alert>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onCancel={() => setModalOpen(false)}
                onConfirm={handleDelete}
            />
        </Container>
    );
};

export default ViewConfigurationPage;
