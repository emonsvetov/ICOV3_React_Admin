import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const AddConfigurationPage = () => {
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
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        const requiredFields = ['name', 'platform_name', 'platform_key', 'platform_url', 'platform_mode', 'account_identifier', 'customer_number', 'udid', 'etid'];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                valid = false;
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
        // Validate form before submitting
        if (!validateForm()) {
            alert('Please fill all required fields.');
            return;
        }
        try {
            await axios.post(`/tango-settings/create`, formData);
            alert('Configuration added successfully!');
            history.push('/tango-settings');
        } catch (error) {
            console.error('Failed to add new configuration:', error);
            alert('Error adding new configuration');
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Add New Configuration</h2>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
                                <Row>
                                    {['name', 'platform_name', 'platform_key', 'platform_url', 'platform_mode', 'account_identifier', 'account_number', 'customer_number', 'udid', 'etid'].map(field => (
                                        <Col md={6} key={field}>
                                            <FormGroup>
                                                <Label for={field}>{field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.replace(/_/g, ' ').slice(1)}:</Label>
                                                <Input
                                                    type="text"
                                                    id={field}
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    invalid={!!errors[field]}
                                                />
                                                <FormFeedback>{errors[field]}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    ))}
                                    <Col md={6}>
                                        <FormGroup check className="mb-2 mr-sm-2 mb-sm-0 pt-2">
                                            <Label check className="mr-4">
                                                <Input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />{' '}
                                                Active
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check className="mb-2 mr-sm-2 mb-sm-0">
                                            <Label check>
                                                <Input type="checkbox" name="is_test" checked={formData.is_test} onChange={handleChange} />{' '}
                                                Test Configuration
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Button type="submit" color="primary">Save Changes</Button>
                                        <Button type="button" onClick={() => history.goBack()} color="secondary">Cancel</Button>
                                    </Col>
                                </Row>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddConfigurationPage;
