import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
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

import AddIconTabs from "./AddIconTabs";
import { fetchEventTypes, getEventLedgerCodes, getMilestoneOptions } from '@/shared/apiHelper'
import { labelizeNamedData, labelizeData, getValueFromMixed, isBadgeAward } from '@/shared/helpers'
import { makeFormData } from './common'
import LedgerCodes from './LedgerCodes';
import {Space, Table} from 'antd';
import AddAwardLevel from "./AddAwardLevel";
import SelectIcon from "./SelectIcon";
const fetchEvent = async (oId, pId, eId) => {
  try {
    const response = await axios.get(`/organization/${oId}/program/${pId}/event/${eId}`);
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const Edit = ({organization, theme, rtl}) => {

  const { programId, eventId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [eventTypeId, setEventTypeId] = useState(false);
  let [event, setEvent] = useState(null);
  const [eventTypesRaw, setEventTypesRaw] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('2');
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const [ledgerCodes, setLedgerCodes] = useState([]);
  const [dataEventAwardsLevels, setDataEventAwardsLevels] = useState([]);
  const [visible, setVisible] = useState(false);
  const [v2icon, setV2icon] = useState('');
    const [dataAwardLevel, setDataAwardLevel] = useState({
        id: 0,
        event_id: 0,
        amount: 0,
        award_level_id: 0,
    });
  const dispatch = useDispatch()
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
    if( program?.id ){
      getListLedgerCodes(program)
    }
  }, [program])

  useEffect(() => {
    if (organization?.id && programId) {
      fetchProgramData(programId)
    }
  }, [programId, organization]);

    useEffect(() => {
        if (eventId && program?.id) {
            setLoading(true)
            fetchEvent(program.organization_id, program.id, eventId)
                .then(res => {
                    setEvent(res)
                    setEventTypeId(res.event_type_id);
                    setDataEventAwardsLevels(res.eventAwardsLevel);
                    setLoading(false)
                    setV2icon(res.icon);
                })
        }
    }, [program, eventId]);

  useEffect( () => {
    if( event?.id && program?.id ) {
      fetchEventTypes(organization.id, programId)
      .then(evtypes => {
        setEventTypesRaw(evtypes)
        setEventTypes(labelizeNamedData(evtypes))
      })
      if( program.allow_milestone_award ) {
        getMilestoneOptions(program.organization_id, program.id)
        .then( o => {
          setMilestoneOptions(labelizeData(o))
        })
      }
    }
  }, [event])

  let history = useHistory();

  const isMilestoneAward = (event_type_id) => {
    const v = getValueFromMixed(event_type_id)
    for(var i in eventTypesRaw)  {
      if( eventTypesRaw[i].type == 'milestone award' && eventTypesRaw[i].id === parseInt(v) ) {
        return true;
      }
    }
    // return event_type_id === 9;
  }

  const onSubmit = (values) => {
    const eventData = makeFormData(program, values)
    eventData.icon = v2icon;
    axios
      .put(`/organization/${program.organization_id}/program/${programId}/event/${eventId}`, eventData)
      .then((res) => {
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

  const onChangeEventType = (value) => {
    setEventTypeId(value.value);
  }

  if (loading || !event) {
    return <p>Loading...</p>;
  }

  if( event.event_icon && !event.icon)  {
    event.icon = event.event_icon
  }

  event.awarding_points = parseFloat(event.max_awardable_amount) * parseInt(program.factor_valuation)

    const columnsEventAwardsLevel = [
        {
            title: 'Award Level ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Award Level Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <a style={{color:'#70bbfd',cursor:"pointer"}} onClick={()=> handleAwardLevelEdit(record)}>Edit</a> |
                    <a style={{color:'#70bbfd',cursor:"pointer"}} onClick={()=>handleAwardLevelDelete(record)}> Delete</a>
                </>
            ),
        },
    ];

    const toggleModal = () => {
        setDataAwardLevel({
            id: 0,
            event_id: eventId,
            amount: 0,
            award_level_id: 0,
        });
        setVisible(!visible);
    };

    const handleSave = (data) => {
        axios.put(`/organization/${program.organization_id}/program/${programId}/event-award-level/${eventId}`, data)
            .then((res) => {
                if (res.status == 200) {
                    flashSuccess(dispatch, "Event saved!")
                    fetchEvent(program.organization_id, program.id, eventId)
                        .then(res => {
                            setDataEventAwardsLevels(res.eventAwardsLevel);
                        })
                }
            }).catch((err) => {
            flashError(dispatch, err.response.data)
            setLoading(false);
        });
    };

    const handleAwardLevelEdit = (data) => {
        setDataAwardLevel(data);
        setVisible(!visible);
    };

    const handleAwardLevelDelete = (data) => {
        axios.delete(`/organization/${program.organization_id}/program/${programId}/event-award-level/${eventId}`, { data: data })
            .then((res) => {
                if (res.status == 200) {
                    flashSuccess(dispatch, "Event saved!")
                    fetchEvent(program.organization_id, program.id, eventId)
                        .then(res => {
                            setDataEventAwardsLevels(res.eventAwardsLevel);
                        })
                }
            }).catch((err) => {
            flashError(dispatch, err.response.data)
            setLoading(false);
        });
    };

    const handleSelectedIcon = (v2icon) => {
        setV2icon(v2icon)
    }

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
                  setEventIcon
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
                                  <h3 className="mb-4">Edit Event</h3>
                              </Col>
                              <Col md="6" lg="6" xl="6" className="text-right">
                                  <ButtonToolbar className="modal__footer flex justify-content-right w100">
                                      <Button
                                          outline
                                          color="primary"
                                          className="mr-3"
                                          onClick={onClickCancel}
                                      >
                                          Close
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
                                                  component={renderSelectField}
                                                  parse={value => {
                                                      onChangeEventType(value)
                                                      return value;
                                                  }}
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </Col>
                              <Col md="6" lg="4" xl="4">
                                  <div className="form__form-group">
                            <span className="form__form-group-label">
                              Enable This Event
                            </span>
                                      <div className="form__form-group-field">
                                          <div className="form__form-group-row">
                                              <Field
                                                  name="enable"
                                                  component={renderToggleButtonField}
                                                  className={'toggle-btn-auto-width'}
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </Col>
                          </Row>
                          <Row>
                              <Col md="6" lg="4" xl="4">
                                  <Field name="name">
                                      {({input, meta}) => (
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
                                              <LedgerCodes program={program} cb_CodeAction={cb_CodeAction}/>
                                          </div>
                                      </div>
                                  </div>
                              </Col>
                          </Row>
                          {!isBadgeAward(eventTypeId) && (
                              <Row>
                                  <Col md="6" lg="4" xl="4">
                                      <Field name="max_awardable_amount">
                                          {({input, meta}) => (
                                              <div className="form__form-group">
                                                  <span className="form__form-group-label">Max Awardable Amount</span>
                                                  <div className="form__form-group-field">
                                                      <div className="form__form-group-row">
                                                          <input onKeyUp={form.mutators.onChangeAwardValue}
                                                                 type="text" {...input} placeholder="Amount"/>
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
                                          {({input, meta}) => (
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
                              </Row>
                          )}
                          {isMilestoneAward(values.event_type_id) && (
                              <Row>
                                  <Col md="6" lg="4" xl="4">
                                      <div className="form__form-group">
                            <span className="form__form-group-label">
                              Select Milestone Frequency
                            </span>
                                          <div className="form__form-group-field">
                                              <div className="form__form-group-row">
                                                  <Field
                                                      name="milestone_award_frequency"
                                                      options={milestoneOptions}
                                                      component={renderSelectField}
                                                      placeholder={values.milestone_award_frequency ? values.milestone_award_frequency : "Select Frequency"}
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  </Col>
                              </Row>
                          )}
                          <Row>
                              <Col md="12" lg="8" xl="2">
                                  <div className="form__form-group">
                                    <span className="form__form-group-label">Icon
                                    </span>
                                  </div>
                              </Col>
                              <Col>
                                  <SelectIcon activeIcon={v2icon} handleSelectedIcon={handleSelectedIcon}/>
                              </Col>
                          </Row>
                          <Row>
                              <Col md="12" lg="8" xl="8">
                                  <div className="form__form-group">
                                      <span className="form__form-group-label">Icon(LOGO)</span>
                                      <div className="form__form-group-field">
                                          <div className="form__form-group-row">
                                              <div
                                                  className="border_hover_div"
                                                  onClick={() => setOpen(true)}
                                              >
                                                  <div className="text">
                                                      {values.event_icon ? values.event_icon.name : "+ Add an Icon"}
                                                  </div>
                                                  {values.event_icon &&
                                                      <div className="email_icon">
                                                          <img src={set_path(values.event_icon)} alt="icons"/>
                                                      </div>}
                                              </div>
                                          </div>
                                      </div>
                                      <Field name="event_icon_id">
                                          {({input, meta}) => (
                                              <>
                                                  <input
                                                      type="hidden"
                                                      {...input}
                                                      placeholder="Event Icon"
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
                                  style={{width: "200%"}}
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
                                  style={{width: "200%"}}
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
                                      {({input, meta}) => (
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
                              icon={values?.icon ? values.icon : values.event_icon}
                              program={program}
                            />
                          </div>
                        </Col>
                      </ModalBody>
                    </Modal>
                  </>
                )}
              </Form>
            </CardBody>
              <Card>
                  <CardBody>
              <Row>
                  <Col md="6" lg="6" xl="6">
                      <Button
                          style={{cursor:"pointer",paddingTop:3,paddingBottom:3}}
                          disabled={loading}
                          className="btn btn-primary"
                          color="#ffffff"
                          onClick={toggleModal}>Add Award Level</Button>
                      <AddAwardLevel visible={visible} onClose={toggleModal} onSave={handleSave} data={dataAwardLevel} programId={programId} organization={program.organization_id}/>
                  </Col>
              </Row>
              <Row>
                  <Col>
                      <Table rowKey="id" columns={columnsEventAwardsLevel} dataSource={dataEventAwardsLevels} />
                  </Col>
              </Row>
                  </CardBody>
              </Card>
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
