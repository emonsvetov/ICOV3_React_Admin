import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import CheckboxField from '@/shared/components/form/CheckBox';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/merchants/addMerchant";
import renderSelectField from '@/shared/components/form/Select';
import axios from 'axios';
import {mapFormDataUploads, patchMerchantMediaURL, unpatchMerchantFields} from '@/shared/helpers'
import renderDropZoneField from '@/shared/components/form/DropZone';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import WYSIWYGEditor from '@/shared/components/form/WYSIWYGEditor'
import {TOA_OPTIONS} from '@/shared/options'
import { useParams } from 'react-router-dom'
import {ORGANIZATION_ID} from '../../App/auth'


const fetchMerchant = async ( id ) => {
    try {
        const response = await axios.get(`/organization/${ORGANIZATION_ID}/merchant/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const EditMerchantForm = () => {

    const dispatch = useDispatch()
    let { id } = useParams();

    // alert(id)

    const [loading, setLoading] = useState(false)
    const [useTango, setUseTango] = useState(false)
    const [errors, setErrors] = useState(null)
    let [merchant, setMerchant] = useState(null)
    //initialValues={patchMerchantMediaWithURL(merchant, ['logo', 'icon', 'large_icon', 'banner'])}

    useEffect( ()=>{
        setLoading(true)
        fetchMerchant( id )
        .then( response => {
            setMerchant(response)
            setLoading(false)
        })
    }, [id])

    const onChangeUseTangoAPI = () => {
        setUseTango( !useTango )
    }

    const onSubmit = values => {
        values = unpatchMerchantFields(values)
        // values = unpatchMerchantMediaURL(values)
        alert(JSON.stringify(values))
        // return;
        let formData = mapFormDataUploads( values )
        // console.log(data)
        // return
        formData.append('_method', 'PUT')
        axios.post(`/organization/1/merchant/${merchant.id}`, formData, {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*"
        })
        .then( (res) => { 
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/merchants?message=Merchant updated successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            // console.log(JSON.stringify(error.response.data.errors));
            setErrors(error.response.data.errors);
            dispatch(sendFlashMessage(JSON.stringify(error.response.data.errors), 'alert-danger'))
            // throw new Error(`API error:${e?.message}`);
            setLoading(false)
        })
    }
    
    const onClickCancel = () => {
        window.location = `/merchants`
    }

    if( loading || !merchant ) return <p>Loading...</p>

    // patchMerchantMediaWithURL()

    // console.log(merchant)
    merchant = patchMerchantMediaURL( merchant )
    // console.log(merchant)

    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={merchant}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form" onSubmit={handleSubmit}>
        {errors && 
            <div className="alert alert-danger fade show w100 mb-4" role="alert">
                <div className="alert__content">{errors}</div>
            </div>
        }
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Edit Merchant</h3>
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
                    <Field
                        name="is_default"
                        type="checkbox"
                        component={CheckboxField}
                        label="Default"
                    />
                </div>
                <div className="form__form-group">
                    <Field 
                        name="is_premium"
                        label="Premium"
                        type="checkbox"
                        component={CheckboxField}
                    />
                </div>
            </Col>
            <Col md="3" lg="3" xl="3">
                <div className="form__form-group">
                    <Field 
                    name="physical_order"
                    label="Physical Order"
                    type="checkbox"
                    component={CheckboxField}
                />
                </div>
                <div className="form__form-group">
                    <Field 
                        name="requires_shipping"
                        label="Requires Shipping"
                        type="checkbox"
                        component={CheckboxField}
                    />
                </div>
            </Col>
            <Col md="3" lg="3" xl="3">
                <div className="form__form-group">
                    <Field 
                        name="giftcodes_require_pin"
                        label="Gift Codes Require PIN"
                        type="checkbox"
                        component={CheckboxField}
                    />
                </div>
                <div className="form__form-group">
                    <Field 
                    name="display_popup"
                    label="Display Popup"
                    type="checkbox"
                    component={CheckboxField}
                />
                </div>
            </Col>
        </Row>
        <Row>
            <Col md="6" lg="6" xl="6">
                <div className="form__form-group">
                    <Field 
                        name="use_tango_api"
                        label="Use Tango API"
                        type="checkbox"
                        component={CheckboxField}
                        parse={ value => {
                            onChangeUseTangoAPI()
                            return value
                        }}
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
        <Row className='mb-3'>
            <Col md="8" lg="8" xl="8">
                <Field
                    name="description"
                    component={WYSIWYGEditor}
                />
            </Col>
        </Row>
        <Row className='mb-3'>
            <Col md="8" lg="8" xl="8">
                <Field
                    name="redemption_instruction"
                    component={WYSIWYGEditor}
                />
            </Col>
        </Row>
        <Row>
            <Col md="8" lg="8" xl="8">
                <div className="form__form-group">
                    <span className="form__form-group-label">Logo</span>
                    <div className="form__form-group-field  flex-column">
                        <Field
                        name="logo"
                        component={renderDropZoneField}
                        multiple={false}
                        customHeight
                        />
                        <RenderImage src={merchant.logo} />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Icon</span>
                    <div className="form__form-group-field flex-column">
                        <Field
                        name="icon"
                        component={renderDropZoneField}
                        multiple={false}
                        customHeight
                        />
                        <RenderImage src={merchant.icon} />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Large Icon</span>
                    <div className="form__form-group-field flex-column">
                        <Field
                            name="large_icon"
                            component={renderDropZoneField}
                            multiple={false}
                            customHeight
                        />
                        <RenderImage src={merchant.large_icon} />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Banner</span>
                    <div className="form__form-group-field flex-column">
                        <Field
                            name="banner"
                            component={renderDropZoneField}
                            multiple={false}
                        />
                        <RenderImage src={merchant.banner} />
                    </div>
                </div>
            </Col>
        </Row>
    </form>
    )}
  </Form>
)}

const RenderImage = ({src}) => {
    if( !src || typeof src === 'undefined' ) return ''
    return (
        <div className='dropzone-img'>
            <img src={src} />
        </div>
    )
}
export default EditMerchantForm;
