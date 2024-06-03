import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';

const EditHmiConfigurationPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        hmi_name: '',
        hmi_username: '',
        hmi_url: '',
        hmi_is_test: ''
    });

    useEffect(() => {
        const fetchConfiguration = async () => {
            try {
                const response = await axios.get(`/hmi/${id}`);
                setFormData({
                    ...response.data,
                    hmi_is_test: response.data.hmi_is_test ? 1 : 0
                });
            } catch (error) {
                console.error('Failed to fetch configuration:', error);
                alert('Failed to load the data.');
            }
        };

        fetchConfiguration();
    }, [id]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked ? 1 : 0 : value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/hmi/edit/${id}`, formData);
            alert('Configuration updated successfully!');
            history.push('/hmi');
        } catch (error) {
            console.error('Failed to update configuration:', error);
            alert('Error updating configuration');
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Edit HMI Configuration</h2>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="hmi_name">HMI Name:</Label>
                                    <Input type="text" name="hmi_name" id="hmi_name" value={formData.hmi_name} onChange={handleChange} invalid={!!errors.hmi_name} />
                                    <FormFeedback>{errors.hmi_name}</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="hmi_username">HMI Username:</Label>
                                    <Input type="text" name="hmi_username" id="hmi_username" value={formData.hmi_username} onChange={handleChange} invalid={!!errors.hmi_username} />
                                    <FormFeedback>{errors.hmi_username}</FormFeedback>
                                </FormGroup>
                                {/*<FormGroup>*/}
                                {/*    <Label for="hmi_password">HMI Password:</Label>*/}
                                {/*    <Input type="password" name="hmi_password" id="hmi_password" value={formData.hmi_password} onChange={handleChange} invalid={!!errors.hmi_password} />*/}
                                {/*    <FormFeedback>{errors.hmi_password}</FormFeedback>*/}
                                {/*</FormGroup>*/}
                                <FormGroup>
                                    <Label for="hmi_url">HMI URL:</Label>
                                    <Input type="text" name="hmi_url" id="hmi_url" value={formData.hmi_url} onChange={handleChange} invalid={!!errors.hmi_url} />
                                    <FormFeedback>{errors.hmi_url}</FormFeedback>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="hmi_is_test" checked={formData.hmi_is_test === 1} onChange={handleChange} />{' '}
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

export default EditHmiConfigurationPage;
