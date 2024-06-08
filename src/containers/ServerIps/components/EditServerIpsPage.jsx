import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';

const EditServerIpsPage = () => {
    const { id } = useParams();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [targetList, setTargetList] = useState([]);
    const [formData, setFormData] = useState({
        ip: '',
        comment: '',
        target: ''
    });

    useEffect(() => {
        const fetchServerIp = async () => {
            try {
                const response = await axios.get(`/server-ips/view/${id}`);
                setFormData({
                    ip: response.data.ip,
                    comment: response.data.comment,
                    target: response.data.target
                });
            } catch (error) {
                console.error('Failed to fetch server IP:', error);
                alert('Failed to load the data.');
            }
        };

        const fetchTargetList = async () => {
            try {
                const response = await axios.get('/server-ips-target');
                console.log(response);  // Debugging line
                setTargetList(response.data.data);
            } catch (error) {
                console.error('Failed to fetch target list:', error);
                alert('Failed to load target list.');
            }
        };

        fetchServerIp();
        fetchTargetList();
    }, [id]);

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
        try {
            await axios.put(`/server-ips/edit/${id}`, formData);
            alert('Server IP updated successfully!');
            history.push('/server-ips');
        } catch (error) {
            console.error('Failed to update server IP:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Error updating server IP');
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <h2>Edit Server IP</h2>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="ip">IP:</Label>
                                    <Input
                                        type="text"
                                        name="ip"
                                        id="ip"
                                        value={formData.ip}
                                        onChange={handleChange}
                                        invalid={!!errors.ip}
                                    />
                                    <FormFeedback>{errors.ip}</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="comment">Comment:</Label>
                                    <Input
                                        type="text"
                                        name="comment"
                                        id="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        invalid={!!errors.comment}
                                    />
                                    <FormFeedback>{errors.comment}</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="target">Target:</Label>
                                    <Input
                                        type="select"
                                        name="target"
                                        id="target"
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

export default EditServerIpsPage;
