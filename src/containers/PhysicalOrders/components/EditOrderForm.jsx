import React, {useState, useEffect} from 'react';
import { Form, Field } from 'react-final-form';
import {Link} from 'react-router-dom';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import formValidation from "@/shared/validation/merchants/addMerchant";
import renderSelectField from '@/shared/components/form/Select';
import axios from 'axios';
import US_STATES from "@/shared/json/usstates.json";
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import { useParams, useHistory } from "react-router-dom";

const STATUS = [
    {label: 'Pending', value: 'pending'},
    {label: 'Cancelled', value: 'cancelled'},
    {label: 'Shipped', value: 'shipped'},
]

const fetchPhysicalOrder = async ( id ) => {
    try {
        const response = await axios.get(`/physical-order/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const EditOrderForm = () => {

    const dispatch = useDispatch()
    let { id } = useParams();

    const [loading, setLoading] = useState(false)
    
    const [errors, setErrors] = useState(null)
    const history = useHistory();
    let [order, setOrder] = useState({email:'brandon.kasper@ttu.edu'});

    useEffect( ()=>{
        setLoading(true)
        
        
        // fetchPhysicalOrder( id )
        // .then( response => {
        //     setDomain(response)
        //     setLoading(false)
        // })
        setLoading(false)
    }, [id])


    const onSubmit = values => {
    
        // setLoading(true)
        // axios.post('/organization/1/program', values)
        // .then( (res) => {
        
        //     if(res.status == 200)  {
        
        //         window.location = '/program?message=New program added successfully!'
        //     }
        // })
        // .catch( error => {
        //     console.log(error.response.data);
        //     setErrors(error.response.data);
        //     setLoading(false)
        // })
    }
    
    const onClickCancel = () => {
        history.goBack();
    }

    if( loading || !order ) return <p>Loading...</p>

    
    return (
    <Form
        onSubmit={onSubmit}
        validate={(values) => formValidation.validateForm(values)}
        initialValues={{
            
            
        }}
    >
    {({ handleSubmit, form, submitting, pristine, values }) => (
    <form className="form form--horizontal" onSubmit={handleSubmit}>
        {errors && 
            <div className="alert alert-danger fade show w100 mb-4" role="alert">
                <div className="alert__content">{errors}</div>
            </div>
        }
        <Row className='w100'>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Edit Order</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className='text-right'>
                <ButtonToolbar className="modal__footer flex justify-content-right w100">
                    <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '}
                    <Button type="submit" disabled={loading || pristine} className="btn btn-primary" color="#ffffff">Save</Button>
                </ButtonToolbar>
            </Col>
        </Row>
        <h5 className='thick size16 mb-4'>Order Information</h5>
        
        <Row className='w100'>
            <Col md={6}>
                <Field name="id">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">ID</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                {id}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            <Col md={6}>
                <Field name="tango_order">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Tango Order</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                            <Link to={`/tango-orders/details/${id}`}>{"RA220126-1278861-89"}</Link>
                                {/* { "Not Submitted"} */}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            <Col md={6}>
                <Field name="email">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Email</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                            { "ivanmota520@gmail.com"}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
        </Row>
        <Row className='w100'>
            <Col md={6}>
                <Field name="created_at">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Created At</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                            {"2022-01-26 13:39:50"}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            <Col md={6}>
                <Field name="updated_at">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Updated At</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                {"2022-01-26 13:39:50"}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            
        </Row>
        <Row className='w100 pt-5'>
            <Col md={6}>
                <Field name="ship_to">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Ship To</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="ship to" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            <Col md={6}>
                <Field name="address1">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Address 1</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Address 1" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            
        </Row>
        <Row className='w100'>
            <Col md={6}>
                <Field name="address_2">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Address 2</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Address 2" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
            <Col md="6" >
                <Field name="city">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">City</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="City" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
        </Row>
        <Row>
            <Col md="6" >
                <div className="form__form-group">
                    <span className="form__form-group-label">State</span>
                    <div className="form__form-group-field">
                        <Field
                            name="state"
                            component={renderSelectField}
                            options={US_STATES}
                        />
                    </div>
                </div>
            </Col>
            <Col md="6" >
                <Field name="zip">
                {({ input, meta }) => (
                    <div className="form__form-group">
                        <span className="form__form-group-label">Zip</span>
                        <div className="form__form-group-field">
                            <div className="form__form-group-row">
                                <input type="text" {...input} placeholder="Zip" />
                                {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
                            </div>
                        </div>
                    </div>
                )}
                </Field>  
            </Col>
        </Row>
        
        <Row>
            <Col md="6" >
                <div className="form__form-group">
                    <span className="form__form-group-label">Country</span>
                    <div className="form__form-group-field">
                        <Field
                            name="country"
                            component={renderSelectField}
                            options={US_STATES}
                        />
                    </div>
                </div>
            </Col>
            <Col md="6" >
                <div className="form__form-group">
                    <span className="form__form-group-label">Order State</span>
                    <div className="form__form-group-field">
                        <Field
                            name="status"
                            component={renderSelectField}
                            options={STATUS}
                        />
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            <Col md="6" >
                <div className="form__form-group">
                    <span className="form__form-group-label">Notes</span>
                    <div className="form__form-group-field">
                        <Field
                        name="note"
                        component="textarea"
                        type="text"
                        readOnly
                        />
                    </div>
                </div>
            </Col>
            
        </Row>
        <h5 className='thick size16 mb-4'>Merchant</h5>
    </form>
    
    )}
  </Form>
)}

export default EditOrderForm;
