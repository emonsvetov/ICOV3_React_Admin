import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import CheckboxField from '@/shared/components/form/CheckBox';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
// import renderRadioButtonField from '@/shared/components/form/RadioButton';
import formValidation from "@/shared/validation/merchants/addMerchant";
import renderSelectField from '@/shared/components/form/Select';
import axios from 'axios';
import {getLabelByCode, patch4Select, unpatchSelect} from '@/shared/helpers'
import renderDropZoneField from '@/shared/components/form/DropZone';

const ROLES = [
    {label: 'Admin', value: 'Admin'},
    {label: 'Customer', value: 'Customer'},
    {label: 'Agent', value: 'Agent'},
]

const TOA_OPTIONS = [
    {label:'Default Production API', value: 1},
    {label:'Visa Debit Card 2- (Cardinal)', value: 2},
    {label:'Visa Debit Card 4, Visa Prepaid card, Visa Debit Card Landmark, Visa Prepaid Debit Card', value: 3},
    {label:'Visa Debit Card', value: 4},
    {label:'Peak Visa Debit', value: 5},
    {label:'Visa Debit Card (Related Group)', value: 6},
    {label:'Sandbox API', value: 7},
]

const AddUserForm = () => {

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [useTango, setUseTango] = useState(false)

    const onChangeUseTangoAPI = () => {
        setUseTango( !useTango )
    }
    
    const onSubmit = values => {
        // alert(JSON.stringify(values))
        // return
        axios.post(`/organization/1/merchant`, values, {
            "Content-Type": "multipart/form-data"
        })
        .then( (res) => {
            console.log(res)
            if(res.status == 200)  {
                // window.location = `/users/view/`
            }
        })
        .catch( error => {
            //console.log(error.response.data);
            setError(error.response.data.errors);
            setLoading(false)
        })
    }
    
    const onClickCancel = () => {
        window.location = `/merchants`
    }

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
                <h3 className="mb-4">Add Merchant</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading || pristine} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="4" xl="4">
                <Field name="name">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Merchant Name</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Merchant Name" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
            <Col md="6" lg="4" xl="4">
                <Field name="merchant_code">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Merchant Code</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Merchant Code" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>
            </Col>
        </Row>
        <Row>
            <Col md="3" lg="3" xl="3">
                <div className="form__form-group">
                    <CheckboxField 
                        name="is_default"
                        label="Default"
                    />
                </div>
                <div className="form__form-group">
                    <CheckboxField 
                        name="is_premium"
                        label="Premium"
                    />
                </div>
            </Col>
            <Col md="3" lg="3" xl="3">
                <div className="form__form-group">
                    <CheckboxField 
                    name="physical_order"
                    label="Physical Order"
                />
                </div>
                <div className="form__form-group">
                    <CheckboxField 
                        name="requires_shipping"
                        label="Requires Shipping"
                    />
                </div>
            </Col>
            <Col md="3" lg="3" xl="3">
                <div className="form__form-group">
                    <CheckboxField 
                        name="giftcodes_require_pin"
                        label="Gift Codes Require PIN"
                    />
                </div>
                <div className="form__form-group">
                    <CheckboxField 
                    name="display_popup"
                    label="Display Popup"
                />
                </div>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="6" xl="6">
                <div className="form__form-group">
                    <CheckboxField 
                        name="use_tango_api"
                        label="Use Tango API"
                        onChange={onChangeUseTangoAPI}
                    /> 
                </div>
                {useTango && 
                    <div className="form__form-group">
                        <span className="form__form-group-label">Tango Configurations</span>
                        <div className="form__form-group-field">
                            <Field
                                name="toa_id"
                                component={renderSelectField}
                                options={TOA_OPTIONS}
                                onChange={onChangeUseTangoAPI}
                            />
                        </div>
                    </div>
                }
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="6" xl="6">
                <Field name="website">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Website</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Website" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
        </Row>        
        <Row>
            <Col md="8" lg="8" xl="8">
                <Field name="description" component="textarea" type="text">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Description</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <textarea name="textarea" type="text" {...input}></textarea>
                                {/* <input type="textarea" {...input} placeholder="Description" /> */}
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
        </Row>
        <Row>
            <Col md="8" lg="8" xl="8">
                <Field name="redemption_instruction" component="textarea" type="text">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Redemption Instruction</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <textarea name="textarea" type="text" {...input}></textarea>
                                {/* <input type="textarea" {...input} placeholder="Description" /> */}
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
        </Row>
        <Row>
            <Col md="8" lg="8" xl="8">
                <div className="form__form-group">
                    <span className="form__form-group-label">Logo</span>
                    <div className="form__form-group-field">
                        <Field
                        name="logo"
                        component={renderDropZoneField}
                        customHeight
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Icon</span>
                    <div className="form__form-group-field">
                        <Field
                        name="icon"
                        component={renderDropZoneField}
                        customHeight
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Large Icon</span>
                    <div className="form__form-group-field">
                        <Field
                        name="large_icon"
                        component={renderDropZoneField}
                        customHeight
                        />
                    </div>
                </div>
            </Col>
        </Row>
    </form>
    )}
  </Form>
)}

export default AddUserForm;
