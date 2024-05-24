import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button } from 'reactstrap';

const EditConfigurationPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({
        name: '',
        platform_name: '',
        platform_key: '',
        platform_url: '',
        platform_mode: '',
        account_identifier: '',
        account_number: '',
        customer_number: '',
        udid: '',
        etid: '',
        status: false,
        is_test: false
    });

    useEffect(() => {
        const fetchConfiguration = async () => {
            try {
                const response = await axios.get(`/tango-settings/${id}`);
                setFormData({
                    ...response.data,
                    status: response.data.status === 1,
                    is_test: response.data.is_test === 1
                });
            } catch (error) {
                console.error('Failed to fetch configuration:', error);
                alert('Failed to load the data.');
            }
        };

        fetchConfiguration();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/tango-settings/edit/${id}`, formData);
            alert('Configuration updated successfully!');
            history.push('/tango-settings');
        } catch (error) {
            console.error('Failed to update configuration:', error);
            alert('Error updating configuration');
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Edit Tango Configuration</h2>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="name">Name:</Label>
                                    <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                                </FormGroup>
                                {['platform_name', 'platform_url', 'platform_mode', 'account_identifier', 'account_number', 'customer_number', 'udid', 'etid'].map(field => (
                                    <FormGroup key={field}>
                                        <Label for={field}>{field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}:</Label>
                                        <Input type="text" name={field} id={field} value={formData[field]} onChange={handleChange} />
                                    </FormGroup>
                                ))}
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />{' '}
                                        Active
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="is_test" checked={formData.is_test} onChange={handleChange} />{' '}
                                        Test Configuration
                                    </Label>
                                </FormGroup>
                                <Button type="submit" color="primary">Save Changes</Button>
                                <Button type="button" color="secondary" onClick={() => history.goBack()}>Cancel</Button>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditConfigurationPage;
