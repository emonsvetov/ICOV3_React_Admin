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
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import axios from "axios";
import Tabs from "./Tabs";

const AddEventForm = ({onStep, organization, program}) => {
  const dispatch = useDispatch()
  // console.log(program)

  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  let [icon, setIcon] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("2");
  const [visibleLedgerCode, setVisibleLedgerCode] = useState(false);
  const [customEmailTemplate, setEnableCustomize] = useState(false);
  // const handleTypeChange = (type) => {
  //   // setEventType(type);
  // };

  const handleCustomTemplate = (value) =>{
      setEnableCustomize(value);
  }
  const set_path = (pickedIcon) => {
    const path = process.env.REACT_APP_API_STORAGE_URL + "/" + pickedIcon.path;
    return path;
  };
  const toggle = () => {
    setOpen((prevState) => !prevState);
  };

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
    eventData["program_id"] = program.id;

    let {
      name,
      enable,
      max_awardable_amount,
      post_to_social_wall,
      message,
      award_message_editable,
      event_icon_id,
      type_id
    } = values;

    // console.log(eventType)
    // return

    eventData.name = name;
    eventData.max_awardable_amount = max_awardable_amount;
    if( post_to_social_wall ) {
      eventData.post_to_social_wall = post_to_social_wall;
    }
    if( award_message_editable ) {
      eventData.award_message_editable = award_message_editable;
    }    
    if( enable ) {
      eventData.enable = enable;
    }
    
    eventData.message = message;
    // eventData.event_icon_id = icon.id;
    eventData.event_icon_id = event_icon_id;
    eventData.include_in_budget = 1;

    //static
    eventData.type_id = type_id.value;

    console.log(eventData)
    // return
    
    axios
      .post(`/organization/${organization.id}/program/${program.id}/event`, eventData)
      .then((res) => {
        //   console.log(res)
        if (res.status == 200) {
          // onStep(0);
          window.location = `/program/view/${program.id}/?message=New event added successfully!`
        }
      })
      .catch((err) => {
        dispatch(sendFlashMessage(<ApiErrorMessage errors={err.response.data} />, 'alert-danger', 'top'))
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    onStep(0);
  };

  const setEventIcon = ([fieldName, fieldVal], state, { changeValue }) => {
    setOpen(false);
    changeValue(state, 'event_icon_id', () => fieldVal.id);
    changeValue(state, fieldName, () => fieldVal);
  }

  // function handlePickImage( pickedIcon ) {
  //   setOpen(false);
  //   setIcon(pickedIcon);
  // }

  const onChangeAwardValue = ([field], state, { setIn, changeValue }) => {
    const v = field.target.value
    if( isNaN( v ) ) return;
    if(field.target.name === 'max_awardable_amount')  
    {
      const field = state.fields["awarding_points"];
      field.change( program.factor_valuation *  v);
    }
    else if(field.target.name === 'awarding_points')  
    {
      const field = state.fields["max_awardable_amount"];
      field.change(  v / program.factor_valuation );
    }
  }
  
  return (
    <>
      <Form
        mutators={{
          // // expect (field, value) args from the mutator
          // setValue: ([field, value], state, { changeValue }) => {
          //   changeValue(state, field, () => value)
          // }
          onChangeAwardValue,
          setEventIcon
        }}
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
        }}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <>
            <form className="form" onSubmit={handleSubmit}>
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
                                name="type_id"
                                options={eventTypes}
                                component={renderSelectField}
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
              
              {customEmailTemplate && 
              <Row>
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
                          />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>}
              
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
    </>
  );
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization
}))(AddEventForm));
