import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col, ButtonToolbar, Button, Modal, ModalBody } from "reactstrap";
import { useParams, withRouter } from "react-router-dom";
import { connect } from 'react-redux';

// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/addEvent";
import renderToggleButtonField from "@/shared/components/form/ToggleButton";
import renderSelectField from '@/shared/components/form/Select'
import {fetchEventTypes} from '@/shared/apiHelper'
import {labelizeNamedData} from '@/shared/helpers'
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

const AddEventForm = ({onStep, organization}) => {

  console.log(organization)

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [eventType, setEventType] = useState({ label: "Standard", value: 1 });
  let [icon, setIcon] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("2");

  const handleTemplateChange = (selectedTemplate) => {
    setTemplate(selectedTemplate.value);
  };
  const handleTypeChange = (type) => {
    // setEventType(type);
  };
  const set_path = (pickedIcon) => {
    const path = process.env.REACT_APP_API_STORAGE_URL + "/" + pickedIcon.path;
    return path;
  };
  const toggle = () => {
    setOpen((prevState) => !prevState);
  };
  const programId = useParams();

  const iconToggle = () => {
    // setIconOpen(prevState => !prevState)
    onStep(2);
  };

  useEffect( () => {
    fetchEventTypes()
    .then( evtypes => {
      // console.log(evtypes)
      setEventTypes(labelizeNamedData(evtypes))
    })
  }, [])

  const onSubmit = (values) => {
    let eventData = {};
    eventData["organization_id"] = organization.id;
    eventData["program_id"] = programId.id;

    let {
      name,
      amount,
      allow_amount_overriding,
      post_to_social_wall,
      message,
    } = values;

    // console.log(eventType)
    // return

    eventData.name = name;
    eventData.amount = amount;
    eventData.allow_amount_overriding = allow_amount_overriding;
    eventData.post_to_social_wall = post_to_social_wall;
    eventData.message = message;
    eventData.email_template_id = template ? template : 3;
    eventData.event_icon_id = icon.id;
    eventData.include_in_budget = 1;

    //static
    eventData.type_id = eventType.value;

    // console.log(eventData)
    // return
    
    axios
      .post(`/organization/${organization.id}/program/${programId.id}/event`, eventData)
      .then((res) => {
        //   console.log(res)
        if (res.status == 200) {
          // onStep(0);
          window.location = `/program/view/${programId.id}/?message=New event added successfully!`
        }
      })
      .catch((error) => {
        //console.log(error.response.data);
        setError(error.response.data.errors);
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    onStep(0);
  };

  function handlePickImage( pickedIcon ) {
    setOpen(false);
    setIcon(pickedIcon);
  }

  const templatePlaceholder = template ? template : "Select a Template";

  return (
    <>
      <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
          enable : true,
          event_type : eventType
        }}
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
                <Field name="amount">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">Max Awardable Amount</span>
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
                      name="enable"
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
                    Select Event Type
                  </span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <Field 
                              name="event_type"
                              options={eventTypes}
                              // placeholder={eventType}
                              component={renderSelectField}
                              parse={value => {
                                handleTypeChange(value)
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
                <div className="form__form-group">
                  <span className="form__form-group-label">
                    Select a Template
                  </span>
                  <div className="form__form-group-field">
                    <div className="form__form-group-row">
                        <Field 
                              name="email_template_id"
                              options={TEMPLATES}
                              // placeholder={templatePlaceholder}
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
                              {icon ? icon.name : "+ Add an Icon"}
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
              <Col md="6" lg="4" xl="4">
                <Field name="point_amount">
                  {({ input, meta }) => (
                    <div className="form__form-group">
                      <span className="form__form-group-label">
                        Awarding Points
                      </span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input
                            type="text"
                            {...input}
                            placeholder="Awarding Points"
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
                      name="award_message_editable"
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
                        Award Message
                      </span>
                      <div className="form__form-group-field">
                        <div className="form__form-group-row">
                          <input
                            type="text"
                            {...input}
                            placeholder="Award Message"
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
          className={`modal-program-events-icons modal-lg ltr-support`}
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
                  onSelectIconOK={handlePickImage}
                  activeTab={activeTab}
                  onCancel={() => setOpen(false)}
                  icon={icon}
                />
              </div>
            </Col>
          </ModalBody>
        </Modal>
      }
    </>
  );
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization
}))(AddEventForm));
