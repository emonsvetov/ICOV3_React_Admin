import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    Modal,
    ModalBody,
    ModalHeader,
    Button,
    ButtonToolbar,
    Row,
    Col,
} from "reactstrap";
import { Form, Field } from "react-final-form";
import axios from "axios";
import PropTypes from 'prop-types';
import { sendFlashMessage } from "@/shared/components/flash";
import { getProgramAction } from "@/redux/actions/programActions";

const EntrataModal = ({ isOpen, toggle, program, userTypes, dispatch, organization }) => {
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);

    const onSubmitForm = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`/entrata/create/${program.account_holder_id}`, values);
            setLoading(false);
            if (response.status === 200) {
                dispatch(sendFlashMessage("Entrata configuration has been updated", "alert-success", "top"));
                dispatch(getProgramAction(organization.id, program.id));
                toggle(); // Close the modal on success
            }
        } catch (error) {
            setLoading(false);
            dispatch(sendFlashMessage("Entrata configuration could not be updated", "alert-danger", "top"));
            console.error(`API error: ${error.message}`);
        }
    };

    const onDelete = async () => {
        if (window.confirm("Are you sure you want to delete this configuration?")) {
            setLoading(true);
            try {
                const response = await axios.delete(`/entrata/delete/${program.account_holder_id}`);
                setLoading(false);
                if (response.status === 200) {
                    dispatch(sendFlashMessage("Entrata configuration has been deleted", "alert-success", "top"));
                    dispatch(getProgramAction(organization.id, program.id));
                    toggle(); // Close the modal on success
                }
            } catch (error) {
                setLoading(false);
                dispatch(sendFlashMessage("Entrata configuration could not be deleted", "alert-danger", "top"));
                console.error(`API error: ${error.message}`);
            }
        }
    };

    const verifyConnection = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`/entrata/verify`, values);
            setLoading(false);
            if (response.status === 200 && response.data.success) {
                setConnectionStatus("Connection successful");
            } else {
                setConnectionStatus("Connection failed");
            }
        } catch (error) {
            setLoading(false);
            setConnectionStatus("Connection failed");
            console.error(`API error: ${error.message}`);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} className="modal-lg">
            <Form
                onSubmit={onSubmitForm}
                initialValues={program}
            >
                {({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <ModalHeader toggle={toggle}>Entrata Configurations</ModalHeader>
                        <ModalBody>
                            <fieldset>
                                <legend>Credentials</legend>
                                <Row>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label htmlFor="url">URL</label>
                                            <Field
                                                name="url"
                                                component="input"
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label htmlFor="entrata_property_id">Entrata Property ID</label>
                                            <Field
                                                name="entrata_property_id"
                                                component="input"
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label htmlFor="username">Username</label>
                                            <Field
                                                name="username"
                                                component="input"
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>
                                    </Col>
                                    {/*<Col md="6">*/}
                                    {/*    <div className="form-group">*/}
                                    {/*        <label htmlFor="user_type">User Type</label>*/}
                                    {/*        <Field name="user_type" component="select" className="form-control">*/}
                                    {/*            <option value="">Select User Type</option>*/}
                                    {/*            {userTypes.map((type) => (*/}
                                    {/*                <option key={type.id} value={type.id}>*/}
                                    {/*                    {type.state}*/}
                                    {/*                </option>*/}
                                    {/*            ))}*/}
                                    {/*        </Field>*/}
                                    {/*    </div>*/}
                                    {/*</Col>*/}
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <Field
                                                name="password"
                                                component="input"
                                                type="password"
                                                className="form-control"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12">
                                        <div className="form-group">
                                            <Button
                                                type="button"
                                                color="primary"
                                                onClick={() => verifyConnection(values)}
                                                disabled={loading}
                                            >
                                                Verify Connection
                                            </Button>
                                            {connectionStatus && (
                                                <p className={connectionStatus === "Connection successful" ? "text-success" : "text-danger"}>
                                                    {connectionStatus}
                                                </p>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </fieldset>
                        </ModalBody>
                        <div className="modal-footer">
                            <ButtonToolbar className="modal__footer flex justify-content-right w100">
                                <Button outline color="secondary" onClick={toggle}>
                                    Close
                                </Button>{" "}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    color="primary"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    disabled={loading}
                                    color="danger"
                                    onClick={onDelete}
                                >
                                    Delete
                                </Button>
                            </ButtonToolbar>
                        </div>
                    </form>
                )}
            </Form>
        </Modal>
    );
};

EntrataModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    program: PropTypes.object.isRequired,
    userTypes: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    organization: PropTypes.object.isRequired,
};

export default withRouter(
    connect((state) => ({
        organization: state.organization,
        userTypes: state.userTypes,
        program: state.program,
    }))(EntrataModal)
);
