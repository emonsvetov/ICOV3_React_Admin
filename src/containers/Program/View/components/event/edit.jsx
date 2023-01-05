import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import Select from "react-select";
import {
  Modal,
  ModalBody, Row, Col, ButtonToolbar, Button, Card, CardBody, Container
} from "reactstrap";
import { connect } from 'react-redux';
import { useParams, useHistory, withRouter } from "react-router-dom";
import { useDispatch, flashSuccess, flashError } from "@/shared/components/flash"
import formValidation from "@/shared/validation/addEvent";
import renderToggleButtonField from "@/shared/components/form/ToggleButton";
import axios from "axios";
import renderSelectField from '@/shared/components/form/Select'
import Tabs from "./Tabs";
import { fetchEventTypes, fetchEmailTemplates } from '@/shared/apiHelper'
import { labelizeNamedData, patch4Select } from '@/shared/helpers'
import { makeFormData } from './common'

const fetchEvent = async (oId, pId, eId) => {
  try {
    const response = await axios.get(`/organization/${oId}/program/${pId}/event/${eId}`);
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const Edit = ({ organization }) => {

  const { programId, eventId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  let [event, setEvent] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [templateContents, setTemplateContents] = useState([]);
  const [visibleLedgerCode, setVisibleLedgerCode] = useState(false);
  const [customEmailTemplate, setEnableCustomize] = useState(false);
  const [activeTab, setActiveTab] = useState('2');

  const dispatch = useDispatch()

  const handleCustomTemplate = (value) => {
    setEnableCustomize(value);
  }

  const tabToggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };


  const set_path = (icon) => {
    const path = process.env.REACT_APP_API_STORAGE_URL + "/" + icon.path;
    return path;
  }

  const fetchProgramData = async (id) => {
    try {
      const { id: organizationId } = organization
      const response = await axios.get(`/organization/${organizationId}/program/${id}`);
      setProgram(response.data)
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  };
  useEffect(() => {
    fetchEventTypes()
      .then(evtypes => {
        setEventTypes(labelizeNamedData(evtypes))
      })
  }, [])
  useEffect(() => {
    if (program?.id) {
      fetchEmailTemplates(program.organization_id, program.id, 'program_event')
        .then(res => {
          // console.log(res)
          setEmailTemplates(labelizeNamedData(res))
          setTemplateContents(res)
        })
    }
  }, [program])

  useEffect(() => {
    if (organization && programId) {
      fetchProgramData(programId)
    }
  }, [programId, organization]);

  useEffect(() => {
    if (program?.id) {
      setLoading(true)
      fetchEvent(program.organization_id, programId, eventId)
        .then(res => {
          setEvent(res)
          setLoading(false)
        })
    }
  }, [program, programId, eventId]);

  let history = useHistory();

  const onSubmit = (values) => {

    const eventData = makeFormData(program, values)

    //template

    // console.log(eventData)
    // return

    axios
      .put(`/organization/${program.organization_id}/program/${programId}/event/${eventId}`, eventData)
      .then((res) => {
        console.log(res)
        if (res.status == 200) {
          flashSuccess(dispatch, "Event saved!")
          // onStep(0);
          // window.location = `/program/view/${programId}/?message=Event ${eventId} Updated successfully!`
        }
      })
      .catch((err) => {
        flashError(dispatch, err.response.data)
        setLoading(false);
      });

    // axios
    // .put(`/organization/${ORGANIZATION_ID}/program/${programId}/event/${eventId}`, eventData,)
    // .then((res) => {
    //       console.log(res)
    //     if (res.status == 200) {
    //     //   window.location = `/program/view/${programId}`;
    //         history.goBack();
    //     }
    // })
    // .catch((error) => {
    //     //console.log(error.response.data);
    //     setError(error.response.data.errors);
    //     setLoading(false);
    // });
  };

  const onClickCancel = () => {
    history.goBack();
  }

  const toggle = () => {
    setOpen(prevState => !prevState)
  }

  const setEventIcon = ([fieldName, fieldVal], state, { changeValue }) => {
    setOpen(false);
    changeValue(state, 'event_icon_id', () => fieldVal.id);
    changeValue(state, fieldName, () => fieldVal);
  }

  const onChangeEmailTemplate = ([field], state, { setIn, changeValue }) => {

    const targetEmailTemplate = state.fields["email_template"];
    const targetTemplateName = state.fields["template_name"];
    const v = field.value

    if (v && templateContents.length > 0) {
      const template = templateContents.find(current => String(current.id) === String(v))
      if (template && template?.id) {
        targetEmailTemplate.change(template.content);
        targetTemplateName.change(template.name);
        return;
      }
    }

    targetEmailTemplate.change("");
    targetTemplateName.change("");
  }

  const onChangeAwardValue = ([field], state, { setIn, changeValue }) => {
    const v = field.target.value
    if (isNaN(v)) return;
    if (field.target.name === 'max_awardable_amount') {
      const field = state.fields["awarding_points"];
      field.change(program.factor_valuation * v);
    }
    else if (field.target.name === 'awarding_points') {
      const field = state.fields["max_awardable_amount"];
      field.change(v / program.factor_valuation);
    }
  }

  if (loading || !event) {
    return <p>Loading...</p>;
  }
  // console.log(event)
  // event = patch4Select(event, 'email_template_id', emailTemplates)
  // console.log(emailTemplates)
  let emailTemplate = emailTemplates.length > 0 ? emailTemplates[0] : null
  let templateContent = templateContents.length > 0 ? templateContents[0] : null
  if (event.email_template_id) {
    if (emailTemplates.length > 0) {
      emailTemplate = emailTemplates.find(template => String(template.value) === String(event.email_template_id))
    }

    if (templateContents.length > 0) {
      templateContent = templateContents.find(current => String(current.id) === String(event.email_template_id))
    }
  }

  event.awarding_points = parseFloat(event.max_awardable_amount) * parseInt(program.factor_valuation)

  // console.log(emailTemplate)

  if (event) {
    return (
      <Container className="dashboard">
        <Col md={12}>
          <Card>
            <CardBody style={{ display: 'flex' }}>
              <Form
                mutators={{
                  // // expect (field, value) args from the mutator
                  // setValue: ([field, value], state, { changeValue }) => {
                  //   changeValue(state, field, () => value)
                  // }
                  onChangeAwardValue,
                  setEventIcon,
                  onChangeEmailTemplate
                }}
                onSubmit={onSubmit}
                validate={(values) => formValidation.validateForm(values)}
                initialValues={event}
              >
                {({ handleSubmit, form, submitting, pristine, values }) => (
                  <>
                    <form className="form" onSubmit={handleSubmit}>
                      <Row className="w100">
                        <Col md="6" lg="6" xl="6">
                          <h3 className="mb-4">Edit Event </h3>
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
                          <Field name="max_awardable_amount">
                            {({ input, meta }) => (
                              <div className="form__form-group">
                                <span className="form__form-group-label">Max Awardable Amount</span>
                                <div className="form__form-group-field">
                                  <div className="form__form-group-row">
                                    <input onKeyUp={form.mutators.onChangeAwardValue} type="text" {...input} placeholder="Amount" />
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
                          <Field name="awarding_points">
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
                                      onKeyUp={form.mutators.onChangeAwardValue}
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

                        {visibleLedgerCode && <Col md="6" lg="4" xl="4">
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
                        </Col>}
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
                                  name="event_type_id"
                                  options={eventTypes}
                                  component={renderSelectField}
                                  initialValue={eventTypes[event.event_type_id - 1]}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
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
                                  <div className="text">
                                    {values.icon ? values.icon.name : "+ Add an Icon"}
                                  </div>
                                  {values.icon &&
                                    <div className="email_icon">
                                      <img src={set_path(values.icon)} alt="icons" />
                                    </div>}
                                </div>
                              </div>
                            </div>
                            <Field name="event_icon_id">
                              {({ input, meta }) => (
                                <>
                                  <input
                                    type="hidden"
                                    {...input}
                                    placeholder="Event Name"
                                  />
                                  {meta.touched && meta.error && (
                                    <span className="form__form-group-error">
                                      {meta.error}
                                    </span>
                                  )}
                                </>
                              )}
                            </Field>
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
                                Custom Email Template
                              </span>
                              <Field
                                name="custom_email_template"
                                component={renderToggleButtonField}
                                parse={value => {
                                  handleCustomTemplate(value)
                                  return value;
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        {!customEmailTemplate &&

                          <Col md="6" lg="4" xl="4">
                            <div className="form__form-group">
                              <span className="form__form-group-label">
                                Select Email Template
                              </span>
                              <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                  {/* <Field name={`email_template_id`}>
                                    {({ input, meta }) => (
                                      <div>
                                        <Select
                                          options={emailTemplates}
                                          clearable={false}
                                          className="react-select"
                                          classNamePrefix="react-select"
                                          placeholder=" - - - "
                                          // onChange={(value)=>alert(value)}
                                          // parse={value => {
                                          //     form.mutators.onChangeEmailTemplate(value)
                                          //     return value;
                                          // }}
                                          {...input}
                                        />
                                        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                                      </div>
                                    )}
                                  </Field> */}
                                  <Field
                                    name="email_template_id"
                                    options={emailTemplates}
                                    component={renderSelectField}
                                    initialValue={emailTemplate}
                                    parse={value => {
                                      form.mutators.onChangeEmailTemplate(value)
                                      return value;
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Col>

                        }
                        <Col md="6" lg="4" xl="4">
                          <div className="form__form-group" style={{ display: customEmailTemplate ? 'block' : 'none' }}>
                            <span className="form__form-group-label">
                              Template Name
                            </span>
                            <div className="form__form-group-field">
                              <div className="form__form-group-row">
                                <Field
                                  name="template_name"
                                  component="input"
                                  type="text"
                                  initialValue={templateContent ? templateContent.name : ''}
                                // parse={value => {
                                //     form.mutators.onChangeEmailTemplate(value)
                                //     return value;
                                // }}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md="12" lg="8" xl="8">
                          <div className="form__form-group">
                            <span className="form__form-group-label">
                              Email Template
                            </span>
                            <div className="form__form-group-field">
                              <div className="form__form-group-row">
                                <Field
                                  name="email_template"
                                  component="textarea"
                                  type="text"
                                  initialValue={templateContent ? templateContent.content : ''}
                                  // parse={value => {
                                  //     form.mutators.onChangeEmailTemplate(value)
                                  //     return value;
                                  // }}
                                  readOnly={!customEmailTemplate}
                                />
                              </div>
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
                              onSelectIconOK={form.mutators.setEventIcon}
                              activeTab={activeTab}
                              onCancel={() => setOpen(false)}
                              icon={values.icon}
                            />
                          </div>
                        </Col>
                      </ModalBody>
                    </Modal>
                  </>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Container>
    );
  }
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization
}))(Edit));
