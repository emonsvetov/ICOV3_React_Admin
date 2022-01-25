import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import {   Modal,
    ModalBody, Row, Col, ButtonToolbar, Button, Card, CardBody, Container  } from "reactstrap";

import { useParams, useHistory } from "react-router-dom";

// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/addEvent";
import renderToggleButtonField from "@/shared/components/form/ToggleButton";
import axios from "axios";
import renderSelectField from '@/shared/components/form/Select'
import Tabs from "./Tabs";
import {ORGANIZATION_ID} from '../../../../App/auth';

const fetchEvent = async ( pId, eId ) => {
    try {
        const response = await axios.get(`/organization/${ORGANIZATION_ID}/program/${pId}/event/${eId}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

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

const Edit = () => {

  const { programId, eventId } = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [icon, setIcon] = useState(null);
  const [event, setEvent] = useState(null)

  const [activeTab, setActiveTab] = useState('2');

  const tabToggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleTemplateChange = (selectedTemplate) => {    
    setTemplate( selectedTemplate.value);
  };
  const set_path = ( icon )=> {
    const path = process.env.REACT_APP_API_STORAGE_URL + "/" + icon.path;
    return path;
  }

  useEffect( () => {
    setLoading(true)
    fetchEvent(programId, eventId)
    .then( res => {
        setEvent(res)
        setLoading(false)
    })
  }, [programId, eventId]);

    let history = useHistory();

    const onSubmit = (values) => {
        console.log(values)
        let eventData = Object.assign(values);

        eventData["organization_id"] = 1;
        eventData["program_id"] = programId;
        
        // delete eventData['email_template_id'];

        //static
        eventData.type_id = 1;
        eventData.event_icon_id = icon ? icon.id : event.event_icon_id;
        eventData.email_template_id = template ? template : 3;
        
        // setLoading(true)
        //
        // console.log(eventData)
        // return;//

        axios
        .put(`/organization/${ORGANIZATION_ID}/program/${programId}/event/${eventId}`, eventData,
        )
        .then((res) => {
              console.log(res)
            if (res.status == 200) {
            //   window.location = `/program/view/${programId}`;
                history.goBack();
            }
        })
        .catch((error) => {
            //console.log(error.response.data);
            setError(error.response.data.errors);
            setLoading(false);
        });
    };

    const onClickCancel = () => {
        history.goBack();
    }

    const toggle = () => {
        setOpen(prevState => !prevState)
    }

    function handlePickImage( selectedIcon ){
        setOpen(false)
        setIcon(selectedIcon)
    }

   const templatePlaceholder = template ? template : "Select a Template";

    if (loading || !event) {
        return <p>Loading...</p>;
    }
    console.log(event)
    if( event )   {
        return (
            <Container className="dashboard">
                <Col md={12}>
                    <Card>
                        <CardBody style={{display:'flex'}}>
                            {
                                <Modal
                                    className={`modal-program modal-lg ltr-support`}
                                    isOpen={isOpen}
                                    toggle={toggle}
                                    >
                                    <ModalBody className="modal-lg">
                                        <Col md={12} lg={12}>
                                            <Row className='w100'>
                                                <Col md="6" lg="6" xl="6">
                                                    <h3>Insert Icon</h3>
                                                </Col>
                                            </Row>
                                            <div className="pt-5 tabs">
                                                <Tabs 
                                                    onSelectIconOK = {handlePickImage} 
                                                    activeTab = {activeTab} 
                                                    toggle = {tabToggle} 
                                                    onCancel = {() =>setOpen(false)}
                                                    icon={icon}
                                                />
                                            </div>
                                        
                                        </Col>
                                    </ModalBody>
                                </Modal>
                            }

                            <Form
                            onSubmit={onSubmit}
                            validate={(values) => formValidation.validateForm(values)}
                            initialValues={event}
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
                                    <h3 className="mb-4">Event Detail</h3>
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
                                            Select a Template
                                            </span>
                                            <div className="form__form-group-field">
                                            <div className="form__form-group-row">
                                            <Field 
                                                name="email_template_id"
                                                options={TEMPLATES}
                                                placeholder={templatePlaceholder}
                                                // defaultValue={event.email_template_id}
                                                // initialValue={{ label: "Happy Birthday", value: 1 }}
                                                // initialValue={(event.email_template_id === null ) ? null : TEMPLATES.find(obj => obj.value === event.email_template_id)}
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
                                            <span className="form__form-group-label">Ledger Code</span>
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
                                    <Col md="12" lg="8" xl="8">
                                    <div className="form__form-group">
                                    <span className="form__form-group-label">Icon</span>
                                        <div className="form__form-group-field">
                                        <div className="form__form-group-row">
                                           
                                            <div className="border_hover_div" onClick={() =>setOpen(true)}>
                                            { !icon & !event.event_icon_id ?
                                            <div className="text">+ Add an Icon</div>:
                                            <>
                                                <div className="email_icon">
                                                    <img src={ icon ? set_path(icon) : set_path(event.icon)} alt="icons" />
                                                </div>
                                                <div className="text">Change Icon</div>
                                            </>
                                            }
                                            
                                            
                                            
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
                                            <span className="form__form-group-label">Email Template</span>
                                            <div className="form__form-group-field">
                                            <div className="form__form-group-row">
                                            <div className="border_div" >

                                                <div className="text">
                                                    {template ? EMAIL_TEMPLATES.find(obj => obj.value === template).label : EMAIL_TEMPLATES.find(obj => obj.value === event.email_template_id).label}
                                                </div>

                                            </div>
                                                
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
                                            name="include_in_budget"
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
                        </CardBody>
                    </Card>
                </Col>
            </Container>
        );
    }
};

export default Edit;