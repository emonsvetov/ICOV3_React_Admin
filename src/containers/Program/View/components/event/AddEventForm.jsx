import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col, ButtonToolbar, Button, Modal, ModalBody } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/addEvent";
import renderToggleButtonField from "@/shared/components/form/ToggleButton";
import { labelizeNamedData, labelizeData } from "@/shared/helpers";
import {getMilestoneOptions} from '@/shared/apiHelper';
import renderSelectField from '@/shared/components/form/Select'
import {fetchEventTypes, getEventLedgerCodes} from '@/shared/apiHelper'
import { useDispatch, flashSuccess, flashError } from "@/shared/components/flash"
import AddIconTabs from "./AddIconTabs";
import{makeFormData} from './common'
import LedgerCodes from './LedgerCodes';

const AddEventForm = ({ onStep, program }) => {
  const dispatch = useDispatch();
  // console.log(program)

  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("2");
  const [ledgerCodes, setLedgerCodes] = useState([]);
  const [visibleLedgerCode, setVisibleLedgerCode] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [milestoneOptions, setMilestoneOptions] = useState([]);

  const set_path = (pickedIcon) => {
    const path = process.env.REACT_APP_API_STORAGE_URL + "/" + pickedIcon.path;
    return path;
  };
  const toggle = () => {
    setOpen((prevState) => !prevState);
  };

  const cb_CodeAction = () => {
    getListLedgerCodes(program)
  }
  const getListLedgerCodes = (program) => {
    getEventLedgerCodes(program.organization_id, program.id)
    .then(ledgercodes => {
      setLedgerCodes(labelizeNamedData(ledgercodes, ["id", "ledger_code"]))
    })
  }

  useEffect(() => {
    if(program?.organization_id)  {
      fetchEventTypes(program.organization_id, program.id).then((evtypes) => {
        setEventTypes(labelizeNamedData(evtypes));
      });
      if( program.allow_milestone_award ) {
        getMilestoneOptions(program.organization_id, program.id)
        .then( o => {
          setMilestoneOptions(labelizeData(o))
        })
      }
      getListLedgerCodes(program)
    }
  }, [program]);

  const handleSelectEventType = (option) => {
    setSelectedEventType(option.label);
  };

  const onSubmit = (values) => {
    const eventData = makeFormData(program, values);
    // console.log(eventData)
    // return

    axios
      .post(
        `/organization/${program.organization_id}/program/${program.id}/event`,
        eventData
      )
      .then((res) => {
        //   console.log(res)
        if (res.status == 200) {
          // onStep(0);
          window.location = `/program/view/${program.id}/?message=New event added successfully!`;
        }
      })
      .catch((err) => {
        flashError(dispatch, err.response.data);
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    onStep(0);
  };

  const setEventIcon = ([fieldName, fieldVal], state, { changeValue }) => {
    setOpen(false);
    changeValue(state, "event_icon_id", () => fieldVal.id);
    changeValue(state, fieldName, () => fieldVal);
  };

  const onChangeAwardValue = ([field], state, { setIn, changeValue }) => {
    const v = field.target.value;
    if (isNaN(v)) return;
    if (field.target.name === "max_awardable_amount") {
      const field = state.fields["awarding_points"];
      field.change(program.factor_valuation * v);
    } else if (field.target.name === "awarding_points") {
      const field = state.fields["max_awardable_amount"];
      field.change(v / program.factor_valuation);
    }
  };

  return (
    <>
      <Form
        mutators={{
          onChangeAwardValue,
          setEventIcon,
        }}
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{}}
      >
        {({ handleSubmit, form, submitting, pristine, values, errors }) => (
          <>
            {JSON.stringify()}
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
                  <div className="form__form-group">
                    <span className="form__form-group-label">
                      Select Event Type
                    </span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                        <Field
                          name="event_type_id"
                          options={eventTypes}
                          parse={(value) => {
                            handleSelectEventType(value);
                            return value;
                          }}
                          placeholder={"Select Event Type"}
                          component={renderSelectField}
                        />
                        {selectedEventType === "Milestone Award" && (
                          <div className="form__form-group-field my-4">
                            <div className="form__form-group-row">
                              <Field
                                name="milestone_award_frequency"
                                options={milestoneOptions}
                                component={renderSelectField}
                                placeholder={"Select Frequency"}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6" lg="4" xl="4">
                  <Field name="name">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Event Name
                        </span>
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
                <Col md="6" lg="4" xl="4">
                  <div className="form__form-group">
                    <span className="form__form-group-label">
                      Ledger Code
                    </span>
                    <div className="form__form-group-field">
                      <div className="form__form-group-row">
                          <Field 
                              name="ledger_code"
                              options={ledgerCodes}
                              isClearable={true}
                              component={renderSelectField}
                          />
                          <LedgerCodes program={program} cb_CodeAction={cb_CodeAction} />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              { 1 == 1 && <Row>
                <Col md="6" lg="4" xl="4">
                  <Field name="max_awardable_amount">
                    {({ input, meta }) => (
                      <div className="form__form-group">
                        <span className="form__form-group-label">
                          Max Awardable Amount
                        </span>
                        <div className="form__form-group-field">
                          <div className="form__form-group-row">
                            <input
                              onKeyUp={form.mutators.onChangeAwardValue}
                              type="text"
                              {...input}
                              placeholder="Amount"
                            />
                            {meta.touched && meta.error && (
                              <span className="form__form-group-error">
                                {meta.error}
                              </span>
                            )}
                            {errors.max_awardable_amountErrors && errors.max_awardable_amountErrors.awardAmountValidator && (
                             <span>{errors.max_awardable_amountErrorsErrors.awardAmountValidator}</span>
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

                {visibleLedgerCode && (
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
                )}
              </Row>}
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
                          {values.icon && (
                            <div className="email_icon">
                              <img src={set_path(values.icon)} alt="icons" />
                            </div>
                          )}
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
                    <AddIconTabs
                      onSelectIconOK={form.mutators.setEventIcon}
                      activeTab={activeTab}
                      onCancel={() => setOpen(false)}
                      icon={values.icon}
                      program={program}
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

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    // organization: state.organization
  }))(AddEventForm)
);
