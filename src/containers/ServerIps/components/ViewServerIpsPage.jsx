import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Alert, ListGroup, ListGroupItem, Button } from 'reactstrap';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const ServerIpViewPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [serverIp, setServerIp] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchServerIp = async () => {
            try {
                const response = await axios.get(`/server-ips/view/${id}`);
                setServerIp(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch server IP');
                setIsLoading(false);
                console.error(err);
            }
        };

        fetchServerIp();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/server-ips/delete/${id}`);
            history.push('/server-ips');
            alert('Server IP successfully deleted.');
        } catch (error) {
            alert('Failed to delete server IP.');
            console.error(error);
        }
    };

    if (isLoading) return <Container>Loading...</Container>;
    if (error) return <Container><Alert color="danger">{error}</Alert></Container>;

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Server IP Details</h2>
                    <Button color="primary" onClick={() => history.push(`/server-ips/edit/${id}`)} style={{ marginRight: '10px' }}>Edit</Button>
                    <Button color="danger" onClick={() => setModalOpen(true)} style={{ marginRight: '10px' }}>Delete</Button>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            {serverIp ? (
                                <ListGroup>
                                    <ListGroupItem><strong>IP:</strong> {serverIp.ip}</ListGroupItem>
                                    <ListGroupItem><strong>Comment:</strong> {serverIp.comment}</ListGroupItem>
                                    <ListGroupItem><strong>Target:</strong> {serverIp.target_name}</ListGroupItem>
                                    <ListGroupItem><strong>Updated By:</strong> {serverIp.first_name} {serverIp.last_name} ({serverIp.email})</ListGroupItem>
                                    <ListGroupItem><strong>Created At:</strong> {serverIp.created_at}</ListGroupItem>
                                    <ListGroupItem><strong>Updated At:</strong> {serverIp.updated_at}</ListGroupItem>
                                </ListGroup>
                            ) : (
                                <Alert color="warning">No server IP details available.</Alert>
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

export default ServerIpViewPage;
