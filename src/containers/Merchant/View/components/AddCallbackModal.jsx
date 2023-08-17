import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ThemeProps, RTLProps } from "@/shared/prop-types/ReducerProps";
import renderSelectField from "@/shared/components/form/Select";
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
import formValidation from "@/shared/validation/program-accounting";

const TYPES = [{ label: "B2B Gift Code", value: "b2b_gift_code" }];
const PROTOCOLS = [
  { label: "http", value: "http" },
  { label: "https", value: "https" },
];
const METHODS = [
  { label: "POST", value: "post" },
  { label: "GET", value: "get" },
  { label: "DELETE", value: "delete" },
  { label: "PUT", value: "put" },
];
const CONTENT_TYPES = [
  { label: "text/html", value: "text/html" },
  { label: "soap", value: "soap" },
  { label: "none", value: "none" },
];
const AddCallbackModal = ({ data, isOpen, setOpen, toggle, theme, rtl }) => {
  const [loading, setLoading] = useState(false);

  const submit = (file) => {
    // const file = csvFile;
    const reader = new FileReader();
  };

  const onSubmit = (values) => {
    // setLoading(true)
    // axios.post('/organization/1/program', values)
    // .then( (res) => {
    //     if(res.status == 200)  {
    //         window.location = '/program?message=New program added successfully!'
    //     }
    // })
    // .catch( error => {
    //     console.log(error.response.data);
    //     setErrors(error.response.data);
    //     setLoading(false)
    // })
  };

  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{}}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="form form--horizontal" onSubmit={handleSubmit}>
            <ModalHeader className="w100">
              <Row className="w100">
                <Col md="6" lg="6" xl="6">
                  <h3>Add Callback</h3>
                </Col>
                <Col md="6" lg="6" xl="6" className="text-right">
                  <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button
                      outline
                      color="primary"
                      className="mr-3"
                      onClick={toggle}
                    >
                      Cancel
                    </Button>{" "}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      color="#ffffff"
                    >
                      Save
                    </Button>
                  </ButtonToolbar>
                </Col>
              </Row>
            </ModalHeader>
            <ModalBody className="modal-lg">
              <Row className="w100">
                <Col md={6}>
                  <Field name="name">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">Name</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input type="text" {...input} placeholder="Name" />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
                <Col md={6}>
                  <Field name="access_key">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Access Key
                        </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                              type="text"
                              {...input}
                              placeholder="Access Key"
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>
              <Row className="w100">
                <Col md={6}>
                  <Field name="secret_key">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Secret Key
                        </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                              type="text"
                              {...input}
                              placeholder="Secret Key"
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
                <Col md="6">
                  <Field name="host_name">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Host Name
                        </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                              type="text"
                              {...input}
                              placeholder="Host Name"
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="form__form-group">
                    <span className="form__form-group-label">Type</span>
                    <div className="form__form-group-field">
                      <Field
                        name="type"
                        component={renderSelectField}
                        options={TYPES}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <Field name="tcp_port">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">TCP Port</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                              type="text"
                              {...input}
                              placeholder="TCP port"
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <div className="form__form-group">
                    <span className="form__form-group-label">Protocol</span>
                    <div className="form__form-group-field">
                      <Field
                        name="protocol"
                        component={renderSelectField}
                        options={PROTOCOLS}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form__form-group">
                    <span className="form__form-group-label">Method</span>
                    <div className="form__form-group-field">
                      <Field
                        name="method"
                        component={renderSelectField}
                        options={METHODS}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="form__form-group">
                    <span className="form__form-group-label">URI</span>
                    <div className="form__form-group-field">
                      <Field
                        name="uri"
                        component="textarea"
                        type="text"
                        readOnly
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form__form-group">
                    <span className="form__form-group-label">Query String</span>
                    <div className="form__form-group-field">
                      <Field
                        name="query_string"
                        component="textarea"
                        type="text"
                        readOnly
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <Field name="function">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">Function</span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                              type="text"
                              {...input}
                              placeholder="Function"
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Col>
                <Col md="6">
                  <div className="form__form-group">
                    <span className="form__form-group-label">Content Type</span>
                    <div className="form__form-group-field">
                      <Field
                        name="content_type"
                        component={renderSelectField}
                        options={CONTENT_TYPES}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form__form-group">
                    <span className="form__form-group-label">Comment</span>
                    <div className="form__form-group-field">
                      <Field
                        name="comment"
                        component="textarea"
                        type="text"
                        readOnly
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </form>
        )}
      </Form>
    </Modal>
  );
};
AddCallbackModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
};

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
  }))(AddCallbackModal)
);
