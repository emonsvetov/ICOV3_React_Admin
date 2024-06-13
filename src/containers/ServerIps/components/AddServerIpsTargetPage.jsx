import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const AddServerIpsTargetPage = () => {
    const [formData, setFormData] = useState({ name: '' });
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!formData.name) {
            valid = false;
            newErrors.name = 'This field is required';
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        if (!validateForm()) {
            return;
        }

        try {
            await axios.post('/server-ips-target/create', formData);
            alert('Target added successfully!');
            history.push('/server-ips');
        } catch (error) {
            console.error('Failed to add new target:', error);
            if (error.response && error.response.status === 409) {
                setErrors({ name: 'Target name already exists' });
            } else if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error adding new target');
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Add New Target</h2>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="name">Target Name:</Label>
                                            <Input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                invalid={!!errors.name}
                                            />
                                            <FormFeedback>{errors.name}</FormFeedback>
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

export default AddServerIpsTargetPage;
