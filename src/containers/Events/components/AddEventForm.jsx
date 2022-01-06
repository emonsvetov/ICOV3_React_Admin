import React, {useState, useCallback} from 'react';
import { Form, Field } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import { Link } from 'react-router-dom'
// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/adduser";
import renderToggleButtonField from '@/shared/components/form/ToggleButton';
import Select from 'react-select';
import axios from 'axios';
import renderDropZoneField from './MyDropZone';

const TEMPLATES = [
    {label: 'Birthday', value: 'Birthday'},
    {label: 'Work Anniversary', value: 'Work Anniversary'},
    {label: 'Custom Template', value: 'Custom Template'},
]

const AddEventForm = () => {

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [template, setTemplate] = useState(null)
    
    

    const handleTemplateChange = useCallback((selectedTemplate) => {
        setTemplate(selectedTemplate)
    }
    );
    
    const onSubmit = values => {
        values["organization_id"] = 1
        // setLoading(true)
        axios.put('/organization/1/users/create', values)
        .then( (res) => {
        //   console.log(res)
          if(res.status == 200)  {
            window.location = `/users/view/${res.data.id}`
          }
        })
        .catch( error => {
          //console.log(error.response.data);
          setError(error.response.data.errors);
          setLoading(false)
        })
    }
    
    const onClickCancel = () => {
        window.location = '/events'
    }

    const templatePlaceholder = template ? template : 'Select a Template'
    
    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        {error && 
            <div className="alert alert-danger fade show w100 mb-4" role="alert">
                <div className="alert__content">{error}</div>
            </div>
        }
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Event Detail</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                <Link style={{paddingRight:'18px', paddingTop:'6px'}}
                                className=""
                                to="/events"
                                >Cancel
                                </Link>
                    
                    <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="4" xl="4">
                <Field name="first_name">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Event Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Event Name" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
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
                       <span className="form__form-group-label" style={{width:'200%'}}>Enable This Event</span>
                        <Field
                        name="phone_notifications"
                        component={renderToggleButtonField}
                        />
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="4" xl="4">
                <Field name="role" component="select">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Select a Template</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <Select
                                    value={template}
                                    onChange={handleTemplateChange}
                                    options={TEMPLATES}
                                    clearable={false}
                                    className="react-select"
                                    placeholder={templatePlaceholder}
                                    classNamePrefix="react-select"
                                    {...input}
                                />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="4" xl="4">
                <Field name="email">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Amount</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Amount" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="phone">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Ledger Code</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Ledger Code" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
        </Row>
        {
            template?
            <>
            <Row>
                <Col md="12" lg="8" xl="8">
                <span className="form__form-group-label">Icon</span>
                <div className="form__form-group-field">
                    <Field
                    name="files"
                    component={renderDropZoneField}
                    customHeight
                    />
                </div>
                
                </Col>
            </Row>
            <Row>
                <Col md="12" lg="8" xl="8">
                    <div className="form__form-group">
                        <span className="form__form-group-label">Email Template</span>
                        <div className="form__form-group-field">
                            <Field
                                name="textarea"
                                component="textarea"
                                type="text"
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            </>
            :''
        }
        <Row>
            <Col md="6" lg="4" xl="4">
                <div className="form__form-group">
                    <div className="form__form-group-field">
                       <span className="form__form-group-label" style={{width:'200%'}}>Post to Social Wall</span>
                        <Field
                        name="social_wall"
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
                       <span className="form__form-group-label" style={{width:'200%'}}>Included in Budget</span>
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
                       <span className="form__form-group-label" style={{width:'200%'}}>Allow amount to be overridden</span>
                        <Field
                        name="allow_overridden"
                        component={renderToggleButtonField}
                        />
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="4" xl="4">
                <Field name="email">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Min amount award override</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Min amount award override" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="phone">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Max amount award override</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Max amount award override" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
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
                       <span className="form__form-group-label" style={{width:'200%'}}>Award Message Editable</span>
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
                <Field name="award_level">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Event Message</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Event Message" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
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
)}

export default AddEventForm;