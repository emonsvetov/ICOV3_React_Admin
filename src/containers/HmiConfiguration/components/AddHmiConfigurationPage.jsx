import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const AddHmiConfigurationPage = () => {
    const [formData, setFormData] = useState({
        hmi_name: '',
        hmi_username: '',
        hmi_password: '',
        hmi_url: '',
        hmi_is_test: false
    });
    const [errors, setErrors] = useState({});
    const history = useHistory();

    const handleChange = (e) => {
        const { name, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : e.target.value
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

        const submitData = {
            ...formData,
            hmi_is_test: formData.hmi_is_test ? 1 : 0
        };

        try {
            await axios.post(`/hmi/create`, submitData);
            alert('Configuration added successfully!');
            history.push('/hmi');
        } catch (error) {
            console.error('Failed to add new configuration:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error adding new configuration');
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Add New HMI Configuration</h2>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
                                <Row>
                                    {['hmi_name', 'hmi_username', 'hmi_password', 'hmi_url'].map(field => (
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
                                            <Label check>
                                                <Input type="checkbox" name="hmi_is_test" checked={formData.hmi_is_test} onChange={handleChange} />{' '}
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

export default AddHmiConfigurationPage;
