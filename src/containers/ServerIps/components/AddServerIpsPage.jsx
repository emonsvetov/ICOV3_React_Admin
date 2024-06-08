import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Button, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const AddServerIpsPage = () => {
    const [formData, setFormData] = useState({
        ip: '',
        comment: '',
        target: ''
    });
    const [targetList, setTargetList] = useState([]);
    const [errors, setErrors] = useState({});
    const history = useHistory();

    useEffect(() => {
        const fetchTargetList = async () => {
            try {
                const response = await axios.get('/server-ips-target');
                setTargetList(response.data.data);
            } catch (error) {
                console.error('Failed to fetch target list:', error);
                alert('Failed to load target list.');
            }
        };

        fetchTargetList();
    }, []);

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        const requiredFields = ['ip', 'target'];

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
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
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
            alert('Please fill all required fields.');
            return;
        }

        try {
            await axios.post('/server-ips/create', formData);
            alert('Server IP added successfully!');
            history.push('/server-ips');
        } catch (error) {
            console.error('Failed to add new server IP:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error adding new server IP');
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Add New Server IP</h2>
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
                                            <Label for="ip">IP:</Label>
                                            <Input
                                                type="text"
                                                id="ip"
                                                name="ip"
                                                value={formData.ip}
                                                onChange={handleChange}
                                                invalid={!!errors.ip}
                                            />
                                            <FormFeedback>{errors.ip}</FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="comment">Comment:</Label>
                                            <Input
                                                type="text"
                                                id="comment"
                                                name="comment"
                                                value={formData.comment}
                                                onChange={handleChange}
                                                invalid={!!errors.comment}
                                            />
                                            <FormFeedback>{errors.comment}</FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="target">Target:</Label>
                                            <Input
                                                type="select"
                                                id="target"
                                                name="target"
                                                value={formData.target}
                                                onChange={handleChange}
                                                invalid={!!errors.target}
                                            >
                                                <option value="">Select a target</option>
                                                {targetList.map(target => (
                                                    <option key={target.id} value={target.id}>{target.name}</option>
                                                ))}
                                            </Input>
                                            <FormFeedback>{errors.target}</FormFeedback>
                                            <a target="_blank" href="/server-ips-target/create" className="inner-button">
                                                &nbsp;<span>Add target</span>
                                            </a>
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

export default AddServerIpsPage;
