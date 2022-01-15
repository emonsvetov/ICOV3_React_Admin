import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col, ButtonToolbar, Button, Modal, ModalBody } from "reactstrap";
import { useParams } from "react-router-dom";

// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/addEvent";
import renderToggleButtonField from "@/shared/components/form/ToggleButton";
import renderSelectField from '@/shared/components/form/Select'
import axios from "axios";
import Tabs from "./Tabs";

const TEMPLATES = [
  { label: "Birthday", value: 1 },
  { label: "Work Anniversary", value: 2 },
  { label: "Custom Template", value: 3 },
];

const EMAIL_TEMPLATES = [
  { label: "Happy Birthday", value: 1 },
  { label: "Good Job", value: 2 },
  { label: "Custom Template Email", value: 3 },
];

const AddEventForm = (props) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [icon, setIcon] = useState("");
  const [iconId, setIconId] = useState(1);

  const [isOpen, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("2");

  const handleTemplateChange = (selectedTemplate) => {
    setTemplate(selectedTemplate.value);
  };
  const set_path = (name) => {
    const path = process.env.SERVER_URL + name;
    return path;
  };
  const toggle = () => {
    setOpen((prevState) => !prevState);
  };
  const programId = useParams();

  const iconToggle = () => {
    // setIconOpen(prevState => !prevState)
    props.onStep(2);
  };

  const onSubmit = (values) => {
    let eventData = {};
    eventData["organization_id"] = 1;
    eventData["program_id"] = programId.id;

    let {
      name,
      amount,
      allow_amount_overriding,
      post_to_social_wall,
      message,
    } = values;

    eventData.name = name;
    eventData.amount = amount;
    eventData.allow_amount_overriding = allow_amount_overriding;
    eventData.post_to_social_wall = post_to_social_wall;
    eventData.message = message;
    eventData.email_template_id = template ? template : 3;
    eventData.icon = icon ?icon:"default";
    eventData.icon_id = iconId;

    //static
    eventData.type_id = 1;
    
    axios
      .post(`/organization/1/program/${programId.id}/event`, eventData)
      .then((res) => {
        //   console.log(res)
        if (res.status == 200) {
          props.onStep(0);
          // window.location = `/program/view/${programId}`;
        }
      })
      .catch((error) => {
        //console.log(error.response.data);
        setError(error.response.data.errors);
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    props.onStep(0);
  };

  function handlePickImage(img, id) {
    setOpen(false);
    setIcon(img);
    setIconId(id);
  }

  const templatePlaceholder = template ? template : "Select a Template";

  return (
    <>
      <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{}}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form className="form" onSubmit={handleSubmit}>
            {error && (
              <div
                className="alert alert-danger fade show w100 mb-4"
                role="alert"
              >
                <div className="alert__content">{error}</div>
              </div>
            )}
            <Row className="w100">
              <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Add New Event </h3>
              </Col>
              <Col md="6" lg="6" xl="6" className="text-right">
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                  <Button
                    outline
                    color="primary"
                    className="mr-3"
                    onClick={onClickCancel}
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
            <Row>
              <Col md="6" lg="4" xl="4">
                <Field name="name">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">Event Name</span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input
                            type="text"
                            {...input}
                            placeholder="Event Name"
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
              <Col md="6" lg="4" xl="4">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <span
                      className="form__form-group-label"
                      style={{ width: "200%" }}
                    >
                      Enable This Event
                    </span>
                    <Field
                      name="enable_event"
                      component={renderToggleButtonField}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6" lg="4" xl="4">
                <div className="form__form-group">
                  <span className="form__form-group-label">
                    Select a Template
                  </span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <Field 
                              name="email_template_id"
                              options={TEMPLATES}
                              placeholder={templatePlaceholder}
                              component={renderSelectField}
                              parse={value => {
                                handleTemplateChange(value)
                                  return value;
                              }}
                          />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6" lg="4" xl="4">
                <Field name="amount">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">Amount</span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input type="text" {...input} placeholder="Amount" />
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

              <Col md="6" lg="4" xl="4">
                <Field name="ledger_code">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">
                        Ledger Code
                      </span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input
                            type="text"
                            {...input}
                            placeholder="Ledger Code"
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
            {template ? (
              <>
                <Row>
                  <Col md="12" lg="8" xl="8">
                    <div className="form__form-group">
                      <span className="form__form-group-label">Icon</span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <div
                            className="border_hover_div"
                            onClick={() => setOpen(true)}
                          >
                            <div className="email_icon">
                              {icon ? (
                                <img src={set_path(icon)} alt="icons" />
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="text">
                              {icon ? icon : "+ Add an Icon"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="12" lg="8" xl="8">
                    <Field name="email_template">
                      {({ input, meta }) => (
                        <div className="form__form-group">
                          <span className="form__form-group-label">
                            Email Template
                          </span>
                          <div className="form__form-group-field">
                            <div className="form__form-group-row">
                              <div className="border_div">
                                <div className="text">
                                  {template
                                    ? EMAIL_TEMPLATES.find(
                                        (obj) => obj.value === template
                                      ).label
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Field>
                  </Col>
                </Row>
              </>
            ) : (
              ""
            )}
            <Row>
              <Col md="6" lg="4" xl="4">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <span
                      className="form__form-group-label"
                      style={{ width: "200%" }}
                    >
                      Post to Social Wall
                    </span>
                    <Field
                      name="post_to_social_wall"
                      component={renderToggleButtonField}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6" lg="4" xl="4">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <span
                      className="form__form-group-label"
                      style={{ width: "200%" }}
                    >
                      Included in Budget
                    </span>
                    <Field
                      name="included_budget"
                      component={renderToggleButtonField}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6" lg="4" xl="4">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <span
                      className="form__form-group-label"
                      style={{ width: "200%" }}
                    >
                      Allow amount to be overridden
                    </span>
                    <Field
                      name="allow_amount_overriding"
                      component={renderToggleButtonField}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6" lg="4" xl="4">
                <Field name="min_amount">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">
                        Min amount award override
                      </span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input
                            type="text"
                            {...input}
                            placeholder="Min amount award override"
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
              <Col md="6" lg="4" xl="4">
                <Field name="max_amount">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">
                        Max amount award override
                      </span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input
                            type="text"
                            {...input}
                            placeholder="Max amount award override"
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
              <Col md="6" lg="4" xl="4">
                <div className="form__form-group">
                  <div className="form__form-group-field">
                    <span
                      className="form__form-group-label"
                      style={{ width: "200%" }}
                    >
                      Award Message Editable
                    </span>
                    <Field
                      name="message_editable"
                      component={renderToggleButtonField}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12" lg="12" xl="12">
                <Field name="message">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">
                        Event Message
                      </span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input
                            type="text"
                            {...input}
                            placeholder="Event Message"
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
          </form>
        )}
      </Form>
      {
        <Modal
          className={`modal-program modal-lg ltr-support`}
          isOpen={isOpen}
          toggle={toggle}
        >
          <ModalBody className="modal-lg">
            <Col md={12} lg={12}>
              <Row className="w100">
                <Col md="6" lg="6" xl="6">
                  <h3>Insert Icon</h3>
                </Col>
              </Row>
              <div className="pt-5 tabs">
                <Tabs
                  onOK={handlePickImage}
                  activeTab={activeTab}
                  onCancel={() => setOpen(false)}
                />
              </div>
            </Col>
          </ModalBody>
        </Modal>
      }
    </>
  );
};

export default AddEventForm;
