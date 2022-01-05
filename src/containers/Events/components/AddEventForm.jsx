import React, {useState} from 'react';
import { Form, Field } from 'react-final-form';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/adduser";
import Select from 'react-select';
import axios from 'axios';

const ROLES = [
    {label: 'Admin', value: 'Admin'},
    {label: 'Customer', value: 'Customer'},
    {label: 'Agent', value: 'Agent'},
]

const AddEventForm = () => {

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState(null)
  
    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole)
    }
    
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
        window.location = '/users'
    }

    const rolePlaceholder = role ? role : 'Select Role'

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
                <h3 className="mb-4">User Profile</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="4" xl="4">
                <Field name="first_name">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">First Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="First Name" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="last_name">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Last Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Last Name" />
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
                <Field name="role" component="select">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">State</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <Select
                                    value={role}
                                    onChange={handleRoleChange}
                                    options={ROLES}
                                    clearable={false}
                                    className="react-select"
                                    placeholder={rolePlaceholder}
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
                        <span className="form__form-group-label">Email</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Email" />
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
                        <span className="form__form-group-label">Phone Number</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Phone Number" />
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
                <Field name="award_level">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Award Level</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Award Level" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="work_anniversary">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Work Anniversary</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Work Anniversary" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="dob">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Birthday</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Birthday" />
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
                <Field name="division">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Department / Team</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Department / Team" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="employee_number">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Employee Number</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Employee Number" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="supervisor_employee_number">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Supervisor ID</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Supervisor ID" />
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
